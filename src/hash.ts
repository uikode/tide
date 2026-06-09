/** Fast djb2 hash for content dedup */
export function djb2(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i)
  }
  return hash >>> 0
}

/** Hash any data structure for equality comparison */
export function contentHash(data: unknown): number {
  return djb2(JSON.stringify(data))
}
