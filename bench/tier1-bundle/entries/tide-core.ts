// Tide core — public API from main entry (no skeleton subpath).
// Namespace import + global retention defeats tree-shaking uniformly across all libs,
// so we measure the full library module (bundlephobia-style), solid-js external.
import * as tide from '../../../dist/index.js'
;(globalThis as any).__keep = tide
