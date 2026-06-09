// @uikode/tide — WebSocket-first SWR framework for SolidJS
// "Data flows. UI follows."

export { createTide } from "./core"
export { TideProvider, useTideWS, useTideWSConnected } from "./ws"
export { prefetch, registerPrefetch, unregisterPrefetch } from "./prefetch"
export { readCache, writeCache, invalidateCache, cacheAge } from "./cache"
export { AuthError, deduped, fetchWithRetry } from "./retry"
export { createUrlFetcher, NOT_MODIFIED } from "./fetcher"
export { contentHash, djb2 } from "./hash"
export { readETag, writeETag, clearETag } from "./etag"
export type {
  TideOptions, TideFetcherOptions, TideUrlOptions,
  TideResult, TideWSConfig, TideProviderProps, MaybeReactive
} from "./types"
