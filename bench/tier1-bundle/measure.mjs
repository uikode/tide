// Tier 1 bundle measurement — uniform method for every library.
// Bundle each entry with esbuild (solid-js EXTERNAL, minify, esm), then compress
// with gzip -9 and brotli q11 via Node zlib. Records installed versions.
import esbuild from 'esbuild'
import zlib from 'node:zlib'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const TARGETS = [
  { id: 'tide-core', label: '@uikode/tide (core)', entry: 'entries/tide-core.ts', verPkg: '../../package.json' },
  { id: 'tide-skeleton', label: '@uikode/tide (core+skeleton)', entry: 'entries/tide-skeleton.ts', verPkg: '../../package.json' },
  { id: 'tanstack', label: '@tanstack/solid-query (bare)', entry: 'entries/tanstack.ts', verPkg: 'node_modules/@tanstack/solid-query/package.json' },
  { id: 'tanstack-persist', label: '@tanstack/solid-query (+persist)', entry: 'entries/tanstack-persist.ts', verPkg: 'node_modules/@tanstack/solid-query/package.json' },
  { id: 'solid-swr', label: 'solid-swr (bare)', entry: 'entries/solid-swr.ts', verPkg: 'node_modules/solid-swr/package.json' },
]

const gzip = (buf) => zlib.gzipSync(buf, { level: 9 }).length
const brotli = (buf) =>
  zlib.brotliCompressSync(buf, {
    params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 },
  }).length

function ver(relPkg) {
  try {
    return JSON.parse(readFileSync(join(__dirname, relPkg), 'utf8')).version
  } catch {
    return 'unknown'
  }
}

const results = []
for (const t of TARGETS) {
  let out
  try {
    const r = await esbuild.build({
      entryPoints: [join(__dirname, t.entry)],
      bundle: true,
      minify: true,
      format: 'esm',
      platform: 'browser',
      external: ['solid-js', 'solid-js/*', 'solid-js/web', 'solid-js/store'],
      write: false,
      legalComments: 'none',
    })
    out = Buffer.from(r.outputFiles[0].contents)
  } catch (e) {
    console.error(`FAILED ${t.id}: ${e.message}`)
    results.push({ id: t.id, label: t.label, version: ver(t.verPkg), error: e.message })
    continue
  }
  results.push({
    id: t.id,
    label: t.label,
    version: ver(t.verPkg),
    minified: out.length,
    gzip: gzip(out),
    brotli: brotli(out),
  })
}

// Console table
console.log('\n=== Tier 1 Bundle Sizes (solid-js external, gzip -9 / brotli q11) ===\n')
console.log(
  'library'.padEnd(34),
  'ver'.padEnd(10),
  'min'.padStart(8),
  'gzip'.padStart(8),
  'brotli'.padStart(8),
)
for (const r of results) {
  if (r.error) {
    console.log(r.label.padEnd(34), (r.version || '').padEnd(10), '  ERROR:', r.error)
    continue
  }
  console.log(
    r.label.padEnd(34),
    String(r.version).padEnd(10),
    String(r.minified).padStart(8),
    String(r.gzip).padStart(8),
    String(r.brotli).padStart(8),
  )
}

const meta = {
  measuredAt: new Date().toISOString(),
  node: process.version,
  method: 'esbuild bundle --minify --format=esm, solid-js external; gzip level 9; brotli quality 11',
  esbuild: ver('node_modules/esbuild/package.json'),
  results,
}
writeFileSync(join(__dirname, 'results.json'), JSON.stringify(meta, null, 2))
console.log('\nWrote results.json')
