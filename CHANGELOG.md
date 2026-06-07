# Changelog

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
