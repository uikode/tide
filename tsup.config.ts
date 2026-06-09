import { defineConfig } from "tsup"
import { solidPlugin } from "esbuild-plugin-solid"

// JSX (TideProvider in ws.tsx, skeleton components) MUST compile to Solid's
// runtime, not React.createElement. esbuild's default JSX is React, which made
// the shipped dist crash at runtime ("React is not defined"). The Solid esbuild
// plugin fixes this while keeping the original dist layout (dist/index.js,
// dist/skeleton/index.js) intact for package exports + the benchmark.
export default defineConfig({
  entry: {
    index: "src/index.ts",
    "skeleton/index": "src/skeleton/index.ts",
  },
  format: ["esm"],
  dts: true,
  clean: true,
  external: ["solid-js", "solid-js/web"],
  treeshake: true,
  splitting: false,
  esbuildPlugins: [solidPlugin()],
})
