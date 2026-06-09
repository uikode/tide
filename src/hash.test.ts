import { describe, it, expect } from "vitest"
import { djb2, contentHash } from "./hash"

describe("djb2", () => {
  it("returns deterministic output", () => {
    expect(djb2("hello")).toBe(djb2("hello"))
  })

  it("different strings produce different hashes", () => {
    expect(djb2("hello")).not.toBe(djb2("world"))
  })

  it("handles empty string", () => {
    expect(djb2("")).toBe(5381 >>> 0)
  })
})

describe("contentHash", () => {
  it("hashes objects deterministically", () => {
    const obj = { a: 1, b: "hello", c: [1, 2, 3] }
    expect(contentHash(obj)).toBe(contentHash({ a: 1, b: "hello", c: [1, 2, 3] }))
  })

  it("different objects produce different hashes", () => {
    expect(contentHash({ a: 1 })).not.toBe(contentHash({ a: 2 }))
  })

  it("handles nested objects", () => {
    const nested = { deep: { nested: { value: 42 } } }
    expect(contentHash(nested)).toBe(contentHash({ deep: { nested: { value: 42 } } }))
  })

  it("handles arrays", () => {
    expect(contentHash([1, 2, 3])).toBe(contentHash([1, 2, 3]))
    expect(contentHash([1, 2, 3])).not.toBe(contentHash([3, 2, 1]))
  })
})
