const ETAG_PREFIX = "tide:etag:"

export function readETag(key: string): string | null {
  return sessionStorage.getItem(ETAG_PREFIX + key)
}

export function writeETag(key: string, etag: string): void {
  sessionStorage.setItem(ETAG_PREFIX + key, etag)
}

export function clearETag(key: string): void {
  sessionStorage.removeItem(ETAG_PREFIX + key)
}
