import type { Accessor } from "solid-js"

export interface TideOptions<T> {
  /** Unique cache key */
  key: string
  /** Data fetcher — receives AbortSignal for cancellation */
  fetcher: (opts?: { signal?: AbortSignal }) => Promise<T>
  /** Extract data from WebSocket message (return null to skip) */
  ws?: (data: any) => T | null
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
  /** Persist to sessionStorage (default: true) */
  persist?: boolean
}

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
  defaults?: Partial<Pick<TideOptions<any>, "staleTime" | "cacheTime" | "pollInterval" | "retries" | "refetchOnFocus" | "pauseOnHidden" | "dedupe" | "persist">>
}
