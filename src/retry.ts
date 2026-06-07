const inflight = new Map<string, Promise<any>>()

/** Deduplicate: if same key already in-flight, return existing promise. */
export function deduped<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (inflight.has(key)) return inflight.get(key)! as Promise<T>
  const p = fn().finally(() => inflight.delete(key))
  inflight.set(key, p)
  return p
}

/** Non-retryable error (e.g. 401 auth failure). */
export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AuthError"
  }
}

/** Fetch with exponential backoff retry. Respects AbortSignal. Throws AuthError on 401. */
export async function fetchWithRetry<T>(
  fn: (opts?: { signal?: AbortSignal }) => Promise<T>,
  retries: number,
  signal?: AbortSignal
): Promise<T> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn({ signal })
    } catch (e: any) {
      if (signal?.aborted || e?.name === "AbortError") throw e
      if (e?.name === "AuthError") throw e // don't retry auth failures
      if (i === retries) throw e
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000))
    }
  }
  throw new Error("unreachable")
}
