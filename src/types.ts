import type { Accessor } from "solid-js"

/** Reactive or static value */
export type MaybeReactive<T> = T | (() => T)

/** Common options shared by both fetcher and url variants */
interface TideBaseOptions<T> {
  /** Unique cache key — static string or reactive getter */
  key: MaybeReactive<string>
  /** Extract data from WebSocket message (return null to skip) */
  ws?: (data: any) => T | null
  /** Dot-notation path to auto-extract from WS message (alternative to ws function) */
  wsPath?: string
  /** Ms before data considered stale (default: 30000) */
  staleTime?: number
  /** Ms before cache evicted entirely (default: 300000) */
  cacheTime?: number
  /** Ms between HTTP polls when WS disconnected (default: 10000) */
  pollInterval?: number
  /** Fetch retry count on failure (default: 3) */
  retries?: number
  /** Refetch after 30s+ tab away (default: true) */
  refetchOnFocus?: boolean
  /** Refetch when network restored (default: true) */
  refetchOnReconnect?: boolean
  /** Pause polling when tab hidden (default: true) */
  pauseOnHidden?: boolean
  /** Prevent duplicate inflight requests (default: true) */
  dedupe?: boolean
  /** Persist to sessionStorage (default: true). Set false for memory-only. */
  persist?: boolean
  /** Skip reactive update if response identical to current (default: false) */
  hashCompare?: boolean
  /** Reactive condition — when false, no fetch/poll/WS (default: true) */
  enabled?: () => boolean
  /** Called after successful fetch */
  onSuccess?: (data: T) => void
  /** Called after fetch failure */
  onError?: (error: Error) => void
}

/** Variant A — custom fetcher (no url/transform/etag) */
export interface TideFetcherOptions<T> extends TideBaseOptions<T> {
  /** Data fetcher — receives AbortSignal for cancellation */
  fetcher: (opts?: { signal?: AbortSignal }) => Promise<T>
  url?: never
  transform?: never
  etag?: never
}

/** Variant B — url shorthand (no manual fetcher) */
export interface TideUrlOptions<T> extends TideBaseOptions<T> {
  /** URL to fetch — built-in handler with credentials, AuthError, ETag */
  url: MaybeReactive<string>
  /** Transform response body before storing */
  transform?: (body: any) => T
  /** Enable ETag-based conditional fetch (default: false) */
  etag?: boolean
  fetcher?: never
}

/** Union of both option variants */
export type TideOptions<T> = TideFetcherOptions<T> | TideUrlOptions<T>

export interface TideResult<T> {
  /** Current data — cached or fresh */
  data: Accessor<T | null>
  /** True only on first load when no cache exists */
  loading: Accessor<boolean>
  /** True during background SWR refresh */
  refreshing: Accessor<boolean>
  /** Data is from cache, refresh pending */
  stale: Accessor<boolean>
  /** Last error message */
  error: Accessor<string | null>
  /** Force immediate refresh */
  refresh: () => Promise<void>
  /** Optimistic update — reverts on next fetch if server disagrees */
  mutate: (fn: (prev: T | null) => T) => void
  /** Warm cache without rendering (for hover prefetch) */
  prefetch: () => void
}

export interface TideWSConfig {
  /** WebSocket URL */
  url: string
  /** Topics to subscribe on connect */
  topics?: string[]
}

export interface TideProviderProps {
  /** WebSocket configuration */
  ws?: TideWSConfig
  /** Default options for all createTide instances */
  defaults?: Partial<Pick<TideBaseOptions<any>, "staleTime" | "cacheTime" | "pollInterval" | "retries" | "refetchOnFocus" | "pauseOnHidden" | "dedupe" | "persist">>
  /** WS reconnect backoff config. Set false to disable (fixed 3s = v1.0). */
  reconnect?: { baseMs?: number; maxMs?: number } | false
  /** WS heartbeat interval ms (default 25000). Set false to disable. */
  heartbeat?: number | false
}
