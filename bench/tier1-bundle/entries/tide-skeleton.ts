// Tide core + skeleton subpath (what a dashboard user actually ships).
import * as tide from '../../../dist/index.js'
import * as skeleton from '../../../dist/skeleton/index.js'
;(globalThis as any).__keep = [tide, skeleton]
