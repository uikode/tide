// @uikode/tide — WebSocket-first SWR framework for SolidJS
// "Data flows. UI follows."

export { createTide } from "./core"
export { TideProvider, useTideWS, useTideWSConnected } from "./ws"
export { prefetch, registerPrefetch, unregisterPrefetch } from "./prefetch"
export { readCache, writeCache, invalidateCache, cacheAge } from "./cache"
export { AuthError, deduped, fetchWithRetry } from "./retry"
export type { TideOptions, TideResult, TideWSConfig, TideProviderProps } from "./types"
