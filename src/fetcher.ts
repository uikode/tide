import { AuthError } from "./retry"
import { readETag, writeETag } from "./etag"

/** Sentinel returned when server responds 304 Not Modified. Checked by reference in core.ts. */
export const NOT_MODIFIED = Symbol("tide:304")

export interface UrlFetcherOpts<T> {
  transform?: (body: any) => T
  etag?: boolean
  key: string
}

/**
 * Built-in URL fetcher. Handles credentials, AuthError on 401, JSON parse, ETag.
 * Returns T on 200, or NOT_MODIFIED sentinel on 304.
 */
export function createUrlFetcher<T>(
  url: string,
  opts: UrlFetcherOpts<T>,
): (fetchOpts?: { signal?: AbortSignal; headers?: Record<string, string> }) => Promise<T> {
  return async (fetchOpts) => {
    const headers: Record<string, string> = { ...fetchOpts?.headers }
    if (opts.etag) {
      const stored = readETag(opts.key)
      if (stored) headers["If-None-Match"] = stored
    }
    const res = await fetch(url, {
      credentials: "include",
      signal: fetchOpts?.signal,
      headers,
    })
    if (res.status === 401) throw new AuthError("Unauthorized")
    if (res.status === 304) return NOT_MODIFIED as unknown as T
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    if (opts.etag) {
      const etag = res.headers.get("etag")
      if (etag) writeETag(opts.key, etag)
    }
    const body = await res.json()
    return (opts.transform ? opts.transform(body) : body) as T
  }
}
