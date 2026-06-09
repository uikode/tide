import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { resolve } from "node:path";

// Multi-page build: one HTML entry per data layer. Identical Solid/Vite/router
// versions across all three (stronger equivalence than 3 separate installs).
// Production build only (no dev HMR) — benchmarked via `vite preview` on :20150.
export default defineConfig({
  plugins: [solid()],
  resolve: {
    // CRITICAL: a single Solid instance across the app + the aliased @uikode/tide.
    // Without dedupe, Vite bundles a 2nd copy of solid-js for Tide's chunk, creating
    // two reactive graphs whose interaction causes an infinite render loop.
    dedupe: ["solid-js", "solid-js/web", "solid-js/store"],
    alias: {
      // Consume Tide's built dist directly (avoids fragile file: linking).
      // Measures the same shipped artifact as Tier 1.
      "@uikode/tide": resolve(__dirname, "../../dist/index.js"),
    },
  },
  build: {
    minify: "esbuild",
    target: "es2022",
    rollupOptions: {
      input: {
        tide: resolve(__dirname, "tide.html"),
        tanstack: resolve(__dirname, "tanstack.html"),
        swr: resolve(__dirname, "swr.html"),
        index: resolve(__dirname, "index.html"),
      },
    },
  },
  server: { port: 20151, strictPort: true },
  preview: { port: 20150, strictPort: true },
});
