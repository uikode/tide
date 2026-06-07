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
| Bundle size | 13KB | ~2KB | **2.8KB** |
| Dependencies | 1 | 0 | **0** |
| SolidJS native | Adapter | ✅ | ✅ |

## Install

```bash
npm install @uikode/tide
```

## Quick Start

```tsx
import { TideProvider, createTide } from "@uikode/tide"

// 1. Wrap your app with TideProvider
function App() {
  return (
    <TideProvider ws={{ url: "ws://localhost:3000/ws" }}>
      <Dashboard />
    </TideProvider>
  )
}

// 2. Use createTide in any component
function Dashboard() {
  const { data, loading, refresh } = createTide<Stats>({
    key: "dashboard",
    fetcher: () => fetch("/api/dashboard").then(r => r.json()),
    ws: (msg) => msg?.dashboard ?? null,
  })

  return (
    <Show when={!loading()} fallback={<DashboardSkeleton />}>
      <StatsPanel data={data()!} />
    </Show>
  )
}
```

That's it. WebSocket push, sessionStorage cache, retry, dedup — all handled automatically.

## How It Works — 5-Layer Data Flow

```
Layer 1: sessionStorage     → 0ms render on page revisit
Layer 2: WebSocket push     → 12ms real-time updates
Layer 3: HTTP SWR fetch     → fallback when WS disconnected
Layer 4: Retry + Abort      → resilient to network failures
Layer 5: Optimistic UI      → actions feel instant
```

1. **Page loads** → check sessionStorage. If cached, render immediately (0ms). Mark as stale.
2. **WebSocket connected** → push updates override stale data in real-time.
3. **WS disconnected** → auto-fallback to HTTP polling with stale-while-revalidate.
4. **Network errors** → exponential backoff retry (1s, 2s, 4s). Abort on re-fetch (no races).
5. **User actions** → `mutate()` for instant optimistic feedback, reconcile on next server response.

## API Reference

### `createTide<T>(options): TideResult<T>`

The core hook. One call per data stream.

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `key` | `string` | — | Unique cache key (required) |
| `fetcher` | `(opts?) => Promise<T>` | — | Data fetcher function (required) |
| `ws` | `(msg: any) => T \| null` | — | Extract data from WS message (return null to skip) |
| `staleTime` | `number` | `30000` | Ms before data considered stale |
| `cacheTime` | `number` | `300000` | Ms before cache evicted |
| `pollInterval` | `number` | `10000` | Ms between HTTP polls (when WS disconnected) |
| `retries` | `number` | `3` | Fetch retry count on failure |
| `refetchOnFocus` | `boolean` | `true` | Refetch after 30s+ tab away |
| `refetchOnReconnect` | `boolean` | `true` | Refetch when network restored |
| `pauseOnHidden` | `boolean` | `true` | Pause polling when tab hidden |
| `dedupe` | `boolean` | `true` | Prevent duplicate inflight requests |
| `persist` | `boolean` | `true` | Persist to sessionStorage |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `data` | `Accessor<T \| null>` | Current data (cached or fresh) |
| `loading` | `Accessor<boolean>` | True only on first load with no cache |
| `refreshing` | `Accessor<boolean>` | True during background SWR refresh |
| `stale` | `Accessor<boolean>` | Data is from cache, refresh pending |
| `error` | `Accessor<string \| null>` | Last error message |
| `refresh` | `() => Promise<void>` | Force immediate refresh |
| `mutate` | `(fn: (prev) => T) => void` | Optimistic update |
| `prefetch` | `() => void` | Warm cache (for hover prefetch) |

### `TideProvider`

Shared context for WebSocket connection and defaults.

```tsx
<TideProvider
  ws={{ url: "ws://localhost:3000/ws", topics: ["dashboard", "alerts"] }}
  defaults={{ staleTime: 15_000, pollInterval: 30_000 }}
>
  <App />
</TideProvider>
```

### `useTideWS()`

Access the raw WebSocket data signal from any component inside TideProvider.

```tsx
const wsData = useTideWS()
createEffect(() => {
  const msg = wsData()
  if (msg?.type === "notification") showToast(msg.text)
})
```

### `useTideWSConnected()`

Reactive boolean — is WebSocket currently connected?

```tsx
const connected = useTideWSConnected()
<Show when={!connected()}>
  <Banner>Reconnecting...</Banner>
</Show>
```

## Skeleton Components

Built-in skeleton shimmer components for common layouts:

```tsx
import { SkeletonCard, SkeletonTable, SkeletonGrid } from "@uikode/tide/skeleton"

// Use as loading fallback
<Show when={data()} fallback={<SkeletonCard lines={4} />}>
  <Card data={data()!} />
</Show>
```

Available: `Skeleton`, `SkeletonCard`, `SkeletonTable`, `SkeletonGrid`, `SkeletonDashboard`, `SkeletonStack`, `SkeletonScheduler`

## Prefetch on Hover

Warm the cache before navigation — zero perceived latency:

```tsx
import { prefetch } from "@uikode/tide"

<a
  href="/settings"
  onMouseEnter={() => prefetch("settings", () => fetch("/api/settings").then(r => r.json()))}
>
  Settings
</a>
```

## Auth Error Handling

Tide detects 401/403 responses and throws `AuthError` — handle globally:

```tsx
import { AuthError } from "@uikode/tide"

// In your error boundary or auth logic
try {
  await refresh()
} catch (e) {
  if (e instanceof AuthError) redirectToLogin()
}
```

## Server-Side Pattern (Recommended)

For best performance, pair Tide with server-side caching + ETag:

```go
// Go/Fiber example
func handleDashboard(c *fiber.Ctx) error {
    fp := computeFingerprint()  // sha256 of data sources
    if c.Get("If-None-Match") == fp {
        return c.SendStatus(304) // unchanged — 0 bytes transferred
    }
    c.Set("ETag", fp)
    return c.JSON(data)
}
```

Result: 2ms API responses + 0ms revisits + real-time WS push = instant UI.

## Benchmarks

Real production data from a dashboard with 11 pages and 12 WebSocket streams:

| Metric | Value |
|--------|-------|
| Revisit render | **0ms** (sessionStorage) |
| Cold first paint | **~50ms** (with server cache) |
| WS → DOM update | **~12ms** |
| Bundle size | **2.8KB** gzip |
| Cache hit rate | **94%** on revisit |
| Dependencies | **0** (solid-js peer) |

## Requirements

- SolidJS `^1.9.0`
- Browser with `sessionStorage` and `WebSocket`

## License

MIT © [Andy Vandaric](https://github.com/andyvandaric) / [UIKode](https://uikode.com)
