# Changelog

## 1.1.0 (2026-06-10)

### New Features

- **`url` shorthand** — pass a URL string instead of a fetcher function; built-in handler with `credentials: 'include'`, AuthError detection, and abort support
- **`transform`** — transform response body before caching (pairs with `url`)
- **`wsPath`** — dot-notation path to auto-extract data from WebSocket messages (e.g. `"data.stack"`)
- **`hashCompare`** — content-based deduplication via djb2 hash; skips reactive updates when data is identical
- **ETag / 304 support** — `etag: true` enables conditional fetch with `If-None-Match`; returns `NOT_MODIFIED` sentinel to skip unnecessary updates
- **Reactive `key` and `url`** — pass a getter `() => string` to re-fetch automatically when key/url changes (dynamic routes, search params)
- **`enabled` flag** — reactive condition to pause/resume fetch+poll+WS processing
- **WS exponential backoff** — reconnect delay scales from 1s to 30s (configurable via `reconnect` prop on TideProvider)
- **WS heartbeat ping** — sends ping frame every 25s to keep connection alive (configurable, disable with `heartbeat: false`)
- **`persist` default `true`** — sessionStorage persistence is now opt-in by default (was opt-in before)

### New Exports

- `createUrlFetcher(url, options)` — built-in URL fetcher with ETag, abort, credentials
- `NOT_MODIFIED` — sentinel symbol for 304 responses
- `contentHash(data)` / `djb2(str)` — content hashing utilities
- `readETag(key)` / `writeETag(key, etag)` / `clearETag(key)` — ETag storage helpers

### Improvements

- `TideOptions<T>` is now a discriminated union (`TideFetcherOptions | TideUrlOptions`) for better type safety
- `MaybeReactive<T>` type for reactive-or-static values
- `TideProviderProps` extended with `reconnect` and `heartbeat` config
- WebSocket provider rewritten with proper backoff + heartbeat lifecycle

### Internal

- Added vitest + jsdom test setup (7 unit tests)
- Added `hash.ts`, `etag.ts`, `fetcher.ts` modules

### Migration from 1.0.0

No breaking changes. All existing `createTide({ key, fetcher, ... })` calls continue to work unchanged.

New features are purely additive:
- To use URL shorthand: replace `fetcher` with `url` (and optionally `transform`)
- To enable ETag: add `etag: true` to URL-based options
- To use wsPath: replace `ws: (msg) => msg?.data?.stack ?? null` with `wsPath: "data.stack"`
- `persist` is now `true` by default — if you relied on the old default (`false`), explicitly set `persist: false`

---

## 1.0.0 (2026-06-08)

### Features

- `createTide<T>()` — 5-layer data flow: cache → WS → HTTP → retry → optimistic
- `TideProvider` — shared WebSocket context with auto-reconnect
- `useTideWS()` — raw WebSocket data signal
- `useTideWSConnected()` — reactive connection status
- `prefetch()` — warm cache on hover for instant navigation
- `mutate()` — optimistic UI updates
- sessionStorage persistence — 0ms render on page revisit
- Visibility pause — stop polling when tab hidden
- Refetch on focus — refresh after 30s+ tab away
- Refetch on reconnect — refresh when network restored
- Request deduplication — same key = one inflight request
- Abort on re-fetch — no race conditions
- Exponential backoff retry (1s, 2s, 4s)
- `AuthError` detection (401/403 → stop polling)
- Dev logging — cache hit/miss/timing in console

### Skeleton Components

- `Skeleton` — base shimmer
- `SkeletonCard` — card with configurable lines
- `SkeletonTable` — table rows shimmer
- `SkeletonGrid` — grid layout shimmer
- `SkeletonDashboard` — full dashboard placeholder
- `SkeletonStack` — stack list shimmer
- `SkeletonScheduler` — scheduler layout shimmer

### Package

- Zero dependencies (solid-js peer only)
- ESM only, tree-shakeable
- Full TypeScript declarations
- ~8.5KB bundle (2.8KB gzip)
- MIT license
