const CACHE_VERSION = 1
const PREFIX = "tide:"

interface CacheEntry<T> {
  data: T
  ts: number
  v: number
}

/** Read cached data. Returns null if missing, expired, or wrong version. */
export function readCache<T>(key: string, maxAge?: number): T | null {
  try {
    const raw = sessionStorage.getItem(PREFIX + key)
    if (!raw) return null
    const entry = JSON.parse(raw) as CacheEntry<T>
    if (entry.v !== CACHE_VERSION) return null
    if (maxAge && Date.now() - entry.ts > maxAge) return null
    return entry.data
  } catch {
    return null
  }
}

/** Write data to cache. Evicts oldest on quota error. */
export function writeCache<T>(key: string, data: T): void {
  const payload = JSON.stringify({ data, ts: Date.now(), v: CACHE_VERSION })
  try {
    sessionStorage.setItem(PREFIX + key, payload)
  } catch {
    evictOldest()
    try {
      sessionStorage.setItem(PREFIX + key, payload)
    } catch {
      // truly full — silent fail
    }
  }
}

/** Remove a specific cache entry. */
export function invalidateCache(key: string): void {
  sessionStorage.removeItem(PREFIX + key)
}

/** Get cache age in ms. Returns Infinity if not cached. */
export function cacheAge(key: string): number {
  try {
    const raw = sessionStorage.getItem(PREFIX + key)
    if (!raw) return Infinity
    const entry = JSON.parse(raw) as CacheEntry<unknown>
    return Date.now() - entry.ts
  } catch {
    return Infinity
  }
}

/** Evict the oldest tide cache entry to free space. */
function evictOldest(): void {
  let oldest = { key: "", ts: Infinity }
  for (let i = 0; i < sessionStorage.length; i++) {
    const k = sessionStorage.key(i)
    if (!k?.startsWith(PREFIX)) continue
    try {
      const { ts } = JSON.parse(sessionStorage.getItem(k)!) as { ts: number }
      if (ts < oldest.ts) oldest = { key: k, ts }
    } catch {
      continue
    }
  }
  if (oldest.key) sessionStorage.removeItem(oldest.key)
}
