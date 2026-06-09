import { createSignal, createEffect, onMount, onCleanup } from "solid-js"
import type { TideOptions, TideFetcherOptions, TideUrlOptions, TideResult, MaybeReactive } from "./types"
import { readCache, writeCache } from "./cache"
import { deduped, fetchWithRetry, AuthError } from "./retry"
import { registerPrefetch, unregisterPrefetch } from "./prefetch"
import { useTideWS, useTideWSConnected } from "./ws"
import { devLog } from "./devlog"
import { createUrlFetcher, NOT_MODIFIED } from "./fetcher"
import { contentHash } from "./hash"

/** Resolve a static or reactive value */
function resolve<V>(v: MaybeReactive<V>): V {
  return typeof v === "function" ? (v as () => V)() : v
}

/** Extract nested value by dot-notation path */
function getByPath(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? null
}

/**
 * createTide — WebSocket-first, stale-while-revalidate data primitive for SolidJS.
 *
 * 5-layer data flow:
 * 1. sessionStorage cache → instant render (0ms)
 * 2. WebSocket push → real-time updates
 * 3. HTTP SWR fetch → fallback when WS disconnected
 * 4. Retry + Abort → resilient to failures
 * 5. Optimistic UI → instant action feedback
 */
export function createTide<T>(opts: TideFetcherOptions<T>): TideResult<T>
export function createTide<T>(opts: TideUrlOptions<T>): TideResult<T>
export function createTide<T>(opts: TideOptions<T>): TideResult<T> {
  const [data, setData] = createSignal<T | null>(null)
  const [loading, setLoading] = createSignal(true)
  const [refreshing, setRefreshing] = createSignal(false)
  const [stale, setStale] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)

  let controller: AbortController | null = null
  let pollTimer: ReturnType<typeof setInterval> | null = null
  let hiddenAt = 0
  let throttleTimer: ReturnType<typeof setTimeout> | null = null
  let stopped = false // set on auth failure — prevents restart
  let lastHash = 0

  const key = resolve(opts.key)
  const staleTime = opts.staleTime ?? 30_000
  const cacheTime = opts.cacheTime ?? 300_000
  const pollInterval = opts.pollInterval ?? 10_000
  const retries = opts.retries ?? 3
  const persist = opts.persist !== false // default true

  // Resolve fetcher: url shorthand → createUrlFetcher, else opts.fetcher
  let currentUrl = "url" in opts && opts.url ? resolve(opts.url!) : null
  let fetcher = currentUrl
    ? createUrlFetcher<T>(currentUrl, {
        transform: opts.transform,
        etag: opts.etag,
        key,
      })
    : (opts as TideFetcherOptions<T>).fetcher

  // --- Layer 1: Cache hydration (SYNCHRONOUS — before first render) ---
  if (persist) {
    const cached = readCache<T>(key, cacheTime)
    if (cached !== null) {
      setData(() => cached)
      setStale(true)
      setLoading(false)
      if (opts.hashCompare) lastHash = contentHash(cached)
      devLog(key, "CACHE HIT")
    } else {
      devLog(key, "CACHE MISS")
    }
  }

  // Trigger background fetch after mount (non-blocking)
  onMount(() => {
    if (opts.enabled?.() === false) return
    refresh()
  })

  // --- Reactive key/url tracking ---
  if (typeof opts.key === "function" || ("url" in opts && typeof opts.url === "function")) {
    createEffect(() => {
      const newKey = resolve(opts.key)
      const newUrl = "url" in opts && opts.url ? resolve(opts.url!) : null
      if (newKey !== key || newUrl !== currentUrl) {
        // Key or URL changed — re-hydrate cache for new key, rebuild fetcher, refresh
        Object.assign(opts, {}) // trigger tracking (key is let-bound above, we update via closure)
        if (newUrl && newUrl !== currentUrl) {
          currentUrl = newUrl
          fetcher = createUrlFetcher<T>(currentUrl, {
            transform: (opts as TideUrlOptions<T>).transform,
            etag: (opts as TideUrlOptions<T>).etag,
            key: newKey,
          })
        }
        // Hydrate cache for new key
        if (persist) {
          const cached = readCache<T>(newKey, cacheTime)
          if (cached !== null) {
            setData(() => cached)
            setStale(true)
          } else {
            setData(() => null)
            setLoading(true)
          }
        }
        lastHash = 0 // reset hash for new key identity
        refresh()
      }
    })
  }

  let wsDelivered = false // tracks if WS has actually pushed valid data

  // --- Layer 2: WebSocket push ---
  const hasWs = !!(opts.ws || opts.wsPath)
  if (hasWs) {
    const wsData = useTideWS()
    createEffect(() => {
      const msg = wsData()
      if (!msg) return
      let extracted: T | null = null
      if (opts.wsPath) {
        extracted = getByPath(msg, opts.wsPath)
      } else if (opts.ws) {
        extracted = opts.ws(msg)
      }
      if (extracted !== null) {
        if (opts.hashCompare) {
          const newHash = contentHash(extracted)
          if (newHash === lastHash) return // skip identical
          lastHash = newHash
        }
        setData(() => extracted)
        setStale(false)
        setLoading(false)
        wsDelivered = true
        throttledCacheWrite(extracted)
        opts.onSuccess?.(extracted)
        devLog(key, "WS PUSH")
      }
    })
  }

  // --- Layer 3: HTTP SWR fetch ---
  async function refresh(): Promise<void> {
    if (stopped) return
    if (opts.enabled?.() === false) return
    controller?.abort()
    controller = new AbortController()
    setRefreshing(true)
    setError(null)

    const doFetch = () => fetchWithRetry(fetcher, retries, controller!.signal)
    const fetchFn = opts.dedupe !== false
      ? () => deduped(key, doFetch)
      : doFetch

    try {
      const start = Date.now()
      const fresh = await fetchFn()

      // Handle 304 Not Modified (ETag hit)
      if ((fresh as unknown) === NOT_MODIFIED) {
        setStale(false)
        devLog(key, "304 NOT MODIFIED")
        return
      }

      // hashCompare: skip update if data identical
      if (opts.hashCompare) {
        const newHash = contentHash(fresh)
        if (newHash === lastHash) {
          setStale(false)
          devLog(key, "HASH MATCH — skip update")
          return
        }
        lastHash = newHash
      }

      setData(() => fresh)
      setStale(false)
      if (persist) writeCache(key, fresh)
      opts.onSuccess?.(fresh)
      devLog(key, "FETCH OK", { ms: Date.now() - start })
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        if (e?.name === "AuthError") {
          // 401 — stop everything, redirect to login
          stopped = true
          stopPolling()
          controller = null
          if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
            window.location.href = "/login"
          }
          return
        }
        setError(e?.message ?? "fetch failed")
        opts.onError?.(e)
        devLog(key, "FETCH ERROR", e?.message)
      }
    } finally {
      setRefreshing(false)
      setLoading(false)
    }
  }

  // --- Layer 4: Polling fallback (when WS disconnected) ---
  const wsConnected = hasWs ? useTideWSConnected() : () => false

  function startPolling() {
    if (pollTimer || stopped) return
    pollTimer = setInterval(refresh, pollInterval)
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = null
    }
  }

  createEffect(() => {
    if (opts.enabled?.() === false) {
      stopPolling()
      return
    }
    if (hasWs) {
      if (wsConnected() && wsDelivered) {
        // Only stop polling if WS has actually delivered valid data
        stopPolling()
      } else {
        startPolling()
      }
    } else {
      // No WS configured — always poll
      startPolling()
    }
  })

  // --- Layer 5: Visibility management ---
  if (opts.pauseOnHidden !== false) {
    const handleVisibility = () => {
      if (document.hidden) {
        hiddenAt = Date.now()
        stopPolling()
      } else {
        const away = Date.now() - hiddenAt
        if (away > 30_000 && opts.refetchOnFocus !== false) {
          refresh()
        }
        if (!wsConnected()) startPolling()
      }
    }
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibility)
      onCleanup(() => document.removeEventListener("visibilitychange", handleVisibility))
    }
  }

  // --- Cleanup ---
  onCleanup(() => {
    stopPolling()
    controller?.abort()
    if (throttleTimer) clearTimeout(throttleTimer)
    unregisterPrefetch(key)
  })

  // --- Throttled cache write (prevent spam on rapid WS pushes) ---
  function throttledCacheWrite(value: T) {
    if (!persist) return
    if (throttleTimer) return // already scheduled
    throttleTimer = setTimeout(() => {
      writeCache(key, value)
      throttleTimer = null
    }, 500)
  }

  // --- Optimistic mutation ---
  function mutate(fn: (prev: T | null) => T) {
    const next = fn(data())
    setData(() => next)
    if (persist) writeCache(key, next)
  }

  // --- Prefetch registry ---
  registerPrefetch(key, () => { refresh() })

  return {
    data,
    loading,
    refreshing,
    stale,
    error,
    refresh,
    mutate,
    prefetch: () => refresh(),
  }
}
