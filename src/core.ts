import { createSignal, createEffect, onMount, onCleanup } from "solid-js"
import type { TideOptions, TideResult } from "./types"
import { readCache, writeCache } from "./cache"
import { deduped, fetchWithRetry, AuthError } from "./retry"
import { registerPrefetch, unregisterPrefetch } from "./prefetch"
import { useTideWS, useTideWSConnected } from "./ws"
import { devLog } from "./devlog"

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

  const staleTime = opts.staleTime ?? 30_000
  const cacheTime = opts.cacheTime ?? 300_000
  const pollInterval = opts.pollInterval ?? 10_000
  const retries = opts.retries ?? 3

  // --- Layer 1: Cache hydration (SYNCHRONOUS — before first render) ---
  if (opts.persist !== false) {
    const cached = readCache<T>(opts.key, cacheTime)
    if (cached !== null) {
      setData(() => cached)
      setStale(true)
      setLoading(false)
      devLog(opts.key, "CACHE HIT")
    } else {
      devLog(opts.key, "CACHE MISS")
    }
  }

  // Trigger background fetch after mount (non-blocking)
  onMount(() => {
    refresh()
  })

  // --- Layer 2: WebSocket push ---
  if (opts.ws) {
    const wsData = useTideWS()
    createEffect(() => {
      const msg = wsData()
      if (!msg) return
      const extracted = opts.ws!(msg)
      if (extracted !== null) {
        setData(() => extracted)
        setStale(false)
        setLoading(false)
        throttledCacheWrite(extracted)
        devLog(opts.key, "WS PUSH")
      }
    })
  }

  // --- Layer 3: HTTP SWR fetch ---
  async function refresh(): Promise<void> {
    if (stopped) return
    controller?.abort()
    controller = new AbortController()
    setRefreshing(true)
    setError(null)

    const doFetch = () => fetchWithRetry(opts.fetcher, retries, controller!.signal)
    const fetchFn = opts.dedupe !== false
      ? () => deduped(opts.key, doFetch)
      : doFetch

    try {
      const start = Date.now()
      const fresh = await fetchFn()
      setData(() => fresh)
      setStale(false)
      if (opts.persist !== false) writeCache(opts.key, fresh)
      devLog(opts.key, "FETCH OK", { ms: Date.now() - start })
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
        devLog(opts.key, "FETCH ERROR", e?.message)
      }
    } finally {
      setRefreshing(false)
      setLoading(false)
    }
  }

  // --- Layer 4: Polling fallback (when WS disconnected) ---
  const wsConnected = opts.ws ? useTideWSConnected() : () => false

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
    if (opts.ws) {
      if (wsConnected()) {
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
    unregisterPrefetch(opts.key)
  })

  // --- Throttled cache write (prevent spam on rapid WS pushes) ---
  function throttledCacheWrite(value: T) {
    if (opts.persist === false) return
    if (throttleTimer) return // already scheduled
    throttleTimer = setTimeout(() => {
      writeCache(opts.key, value)
      throttleTimer = null
    }, 500)
  }

  // --- Optimistic mutation ---
  function mutate(fn: (prev: T | null) => T) {
    const next = fn(data())
    setData(() => next)
    if (opts.persist !== false) writeCache(opts.key, next)
  }

  // --- Prefetch registry ---
  registerPrefetch(opts.key, () => { refresh() })

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
