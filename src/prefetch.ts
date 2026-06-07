type PrefetchFn = () => void

const registry = new Map<string, PrefetchFn>()

/** Register a prefetch function for a tide key. Called by createTide internally. */
export function registerPrefetch(key: string, fn: PrefetchFn): void {
  registry.set(key, fn)
}

/** Unregister prefetch (on cleanup). */
export function unregisterPrefetch(key: string): void {
  registry.delete(key)
}

/** Trigger prefetch for a key. Use on hover/focus to warm cache before navigation. */
export function prefetch(key: string): void {
  registry.get(key)?.()
}
