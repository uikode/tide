# @uikode/tide 🌊

> WebSocket-first data framework for SolidJS. Data flows. UI follows.

[![npm](https://img.shields.io/npm/v/@uikode/tide)](https://npmjs.com/package/@uikode/tide)
[![bundle](https://img.shields.io/bundlephobia/minzip/@uikode/tide)](https://bundlephobia.com/package/@uikode/tide)
[![MIT](https://img.shields.io/github/license/uikode/tide)](LICENSE)

## Why Tide?

Built for **real-time dashboards** where data arrives via WebSocket. Most data-fetching libraries are HTTP-first — they poll, then cache. Tide is push-first: data flows to your UI through WebSocket, with HTTP as fallback.

| | TanStack Query | solid-swr | @uikode/tide |
|---|:---:|:---:|:---:|
| WebSocket-first | ❌ Manual | ❌ | ✅ Built-in |
| Instant revisit (0ms) | ❌ | ❌ | ✅ sessionStorage |
| Skeleton system | ❌ | ❌ | ✅ Included |
| Prefetch on hover | ❌ Manual | ❌ | ✅ Built-in |
| ETag / 304 | ❌ Manual | ❌ | ✅ Built-in |
| Content dedup | ❌ | ❌ | ✅ hashCompare |
| WS backoff + heartbeat | ❌ | ❌ | ✅ Built-in |
| Bundle size | 13KB | ~2KB | **~3KB** |
| Dependencies | 1 | 0 | **0** |
| SolidJS native | Adapter | ✅ | ✅ |

## Install

```bash
npm install @uikode/tide
```

Peer dependency: `solid-js ^1.9.0`

## Quick Start

```tsx
import { TideProvider, createTide } from "@uikode/tide"

// 1. Wrap your app
function App() {
  return (
    <TideProvider ws={{ url: "wss://your-server/ws" }}>
      <Dashboard />
    </TideProvider>
  )
}

// 2. Fetch data — URL shorthand (new in v1.1)
function Dashboard() {
  const stats = createTide<Stats>({
    key: "dashboard",
    url: "/api/dashboard",
    wsPath: "data.dashboard",  // auto-extract from WS
  })

  return (
    <Show when={!stats.loading()} fallback={<Skeleton />}>
      <StatsGrid data={stats.data()!} />
    </Show>
  )
}
```

## Features

### Core (v1.0)

- **5-layer data flow** — sessionStorage → WebSocket → HTTP SWR → retry → optimistic
- **0ms revisit** — renders instantly from sessionStorage, refreshes in background
- **WebSocket push** — real-time updates merged automatically
- **Prefetch on hover** — warm cache before navigation
- **Optimistic mutations** — instant UI, reverts if server disagrees
- **Visibility pause** — stops polling when tab hidden
- **Refetch on focus/reconnect** — catches up after tab-away or network loss
- **Request deduplication** — same key = one inflight request
- **Abort on re-fetch** — no race conditions
- **Exponential retry** — 1s, 2s, 4s with configurable count
- **AuthError detection** — 401/403 stops polling, lets app handle redirect
- **Skeleton components** — shimmer placeholders matching real layouts

### New in v1.1

- **`url` shorthand** — no fetcher boilerplate, built-in credentials + abort
- **`transform`** — reshape response before caching
- **`wsPath`** — dot-notation extraction (`"data.stack"` instead of `msg => msg?.data?.stack ?? null`)
- **`hashCompare`** — skip reactive updates when content unchanged (djb2 hash)
- **ETag / 304** — conditional fetch, zero-cost cache validation
- **Reactive key/url** — pass `() => string` for dynamic routes
- **`enabled` flag** — reactive pause/resume
- **WS exponential backoff** — 1s → 30s reconnect with jitter
- **WS heartbeat** — 25s ping keeps connections alive

## Usage Patterns

### URL shorthand (v1.1)

```tsx
// Before (v1.0)
const data = createTide({
  key: "gateways",
  fetcher: ({ signal }) =>
    fetch("/api/gateways", { signal, credentials: "include" })
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() }),
  ws: (msg) => msg?.data?.hermes?.gateways ?? null,
})

// After (v1.1)
const data = createTide({
  key: "gateways",
  url: "/api/gateways",
  wsPath: "data.hermes.gateways",
})
```

### ETag / conditional fetch

```tsx
const data = createTide({
  key: "tooling",
  url: "/api/agentic/tooling",
  etag: true,  // sends If-None-Match, skips update on 304
})
```

### Content deduplication

```tsx
const data = createTide({
  key: "stack",
  url: "/api/stack/status",
  hashCompare: true,  // no re-render if data identical
})
```

### Reactive key (dynamic routes)

```tsx
const [query, setQuery] = createSignal("react")

const results = createTide({
  key: () => `search-${query()}`,
  url: () => `/api/search?q=${query()}`,
})
```

### Conditional fetch

```tsx
const [loggedIn, setLoggedIn] = createSignal(false)

const data = createTide({
  key: "private",
  url: "/api/private",
  enabled: () => loggedIn(),
})
```

### WS backoff + heartbeat config

```tsx
<TideProvider
  ws={{ url: "wss://server/ws" }}
  reconnect={{ baseMs: 1000, maxMs: 30000 }}
  heartbeat={25000}
>
  <App />
</TideProvider>
```

## API Reference

### `createTide<T>(options)`

```ts
// Variant A: custom fetcher
createTide<T>({
  key: string | (() => string),
  fetcher: (opts?: { signal?: AbortSignal }) => Promise<T>,
  ws?: (data: any) => T | null,
  wsPath?: string,
  staleTime?: number,       // default: 30000
  cacheTime?: number,       // default: 300000
  pollInterval?: number,    // default: 10000
  retries?: number,         // default: 3
  persist?: boolean,        // default: true
  hashCompare?: boolean,    // default: false
  enabled?: () => boolean,  // default: () => true
  refetchOnFocus?: boolean,
  refetchOnReconnect?: boolean,
  pauseOnHidden?: boolean,
  dedupe?: boolean,
  onSuccess?: (data: T) => void,
  onError?: (error: Error) => void,
})

// Variant B: url shorthand
createTide<T>({
  key: string | (() => string),
  url: string | (() => string),
  transform?: (body: any) => T,
  etag?: boolean,           // default: false
  // ...same base options as above
})
```

### `TideResult<T>`

```ts
{
  data: Accessor<T | null>
  loading: Accessor<boolean>      // first load, no cache
  refreshing: Accessor<boolean>   // background SWR
  stale: Accessor<boolean>
  error: Accessor<string | null>
  refresh: () => Promise<void>
  mutate: (fn: (prev: T | null) => T) => void
  prefetch: () => void
}
```

### `TideProvider`

```tsx
<TideProvider
  ws={{ url: string, topics?: string[] }}
  defaults={{ staleTime, cacheTime, pollInterval, retries, persist }}
  reconnect={{ baseMs?: number, maxMs?: number } | false}
  heartbeat={number | false}
>
  {children}
</TideProvider>
```

### Hooks

```ts
useTideWS()           // Accessor<any> — last WS message
useTideWSConnected()  // Accessor<boolean>
```

### Utilities

```ts
prefetch(key, fetcher)     // warm cache
readCache<T>(key)          // read sessionStorage
writeCache(key, data)      // write sessionStorage
invalidateCache(key)       // clear key
cacheAge(key)              // ms since cached

// v1.1
createUrlFetcher(url, opts)  // built-in fetch with ETag/abort
NOT_MODIFIED                 // sentinel for 304
contentHash(data)            // djb2 hash of JSON
readETag(key)                // read stored ETag
writeETag(key, etag)         // store ETag
clearETag(key)               // clear ETag
```

## Skeleton Components

```tsx
import { Skeleton, SkeletonCard, SkeletonGrid, SkeletonTable } from "@uikode/tide/skeleton"

// Base shimmer
<Skeleton class="h-4 w-32" />

// Pre-built layouts
<SkeletonCard lines={3} />
<SkeletonGrid cols={3} rows={2} />
<SkeletonTable rows={5} cols={4} />

// Page-specific (match real content structure)
<SkeletonDashboard />
<SkeletonStack />
<SkeletonScheduler />
<SkeletonGateways />
<SkeletonToolProfiles />
```

## Bundle Size

| Export | Size (gzip) |
|--------|------------|
| Core (`createTide` + utils) | ~2.2KB |
| Skeleton components | ~0.8KB |
| **Total** | **~3KB** |

Zero runtime dependencies. SolidJS is a peer.

## Philosophy

1. **WebSocket-first** — HTTP is the fallback, not the default
2. **Zero-config persistence** — sessionStorage by default, 0ms revisits
3. **Framework-native** — built on SolidJS signals, not a port from React
4. **Real dashboards** — designed for 11-page production dashboard at [ACS](https://uikode.com)
5. **Honest benchmarks** — measured with Playwright, not synthetic

## License

MIT © [Andy Vandaric](https://uikode.com)
