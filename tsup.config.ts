import { defineConfig } from "tsup"

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
})
