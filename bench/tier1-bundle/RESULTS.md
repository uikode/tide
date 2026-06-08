# Tier 1 Results — Bundle Size (Measured)

**Measured:** 2026-06-08 · **Node:** v22.21.1 · **esbuild:** 0.24.2
**Method:** `esbuild --bundle --minify --format=esm`, `solid-js` external (shared peer); compressed with gzip level 9 and brotli quality 11 (Node `zlib`). Namespace import + global retention → measures the full library module uniformly (bundlephobia-style), no per-usage tree-shaking advantage for any library.
**Reproduce:** `cd packages/tide/bench/tier1-bundle && bun install && node measure.mjs`

## Results

| Library | Version | Minified (B) | Gzip (B) | Brotli (B) |
|---------|---------|-------------:|---------:|-----------:|
| @uikode/tide (core) | 1.0.0 | 4,351 | **2,041** | 1,817 |
| @uikode/tide (core+skeleton) | 1.0.0 | 9,849 | **2,873** | 2,564 |
| @tanstack/solid-query (bare) | 5.101.0 | 46,206 | 13,924 | 12,657 |
| @tanstack/solid-query (+persist) | 5.101.0 | 50,941 | **15,484** | 14,086 |
| solid-swr (bare) | 5.0.2 | 3,191 | **1,333** | 1,223 |

## Honest Findings

1. **Tide's "2.8KB" public claim is accurate** — it equals core+skeleton (2,873 B gzip). Core alone is 2,041 B gzip. We can state both precisely.
2. **The fair feature-parity comparison** (instant revisit + persistence) is Tide vs TanStack+persist:
   - Tide core+skeleton **2.87 KB** vs TanStack+persist **15.48 KB** gzip → TanStack is **~5.4× larger**.
   - Even on brotli (what CDNs serve): 2.56 KB vs 14.09 KB → **~5.5×**.
3. **solid-swr is the smallest (1.33 KB gzip) — smaller than Tide.** This is an honest result that does NOT favor us on raw size. solid-swr v5 slimmed down significantly. The difference is capability, not bytes: solid-swr has no WebSocket transport, no built-in sessionStorage persistence, no skeleton system. Report this as a capability trade-off, never hide it.

## Estimate vs Measured (why we re-ran)

| Library | Old estimate (gzip) | Measured (gzip) | Verdict |
|---------|--------------------:|----------------:|---------|
| @uikode/tide | 2.8 KB | 2.87 KB (core+skel) | accurate |
| @tanstack/solid-query | 13 KB | 13.9 KB bare / 15.5 KB +persist | estimate was LOW |
| solid-swr | ~2 KB | 1.33 KB | estimate was HIGH |

Estimates were in the right ballpark but wrong in both directions. Measured numbers now replace them.

## Caveats (for white paper)

- Bundle measured with `solid-js` external (shared peer dep — every SolidJS app already ships it once). Total-including-solid-js can be reported separately for context.
- "Full module" measurement (namespace import) is uniform but may slightly overstate libs with excellent tree-shaking when a user imports only one symbol. A "minimal realistic import" variant can be added if reviewers request; chosen uniform method avoids guessing each lib's exact exports and is the standard package-size metric.
- Versions are the latest stable as of 2026-06-08 (what a new adopter installs). Pinned in `package.json` + recorded in `results.json`.
