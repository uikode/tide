# Benchmark Pre-Registration — Tide vs TanStack vs solid-swr

**Committed:** 2026-06-08 (BEFORE any data collection)
**Protocol:** `.hermes/plans/2026-06-08_tide-vs-tanstack-real-benchmark.md`
**Purpose:** Lock research questions, metrics, and statistical analysis plan before measuring, to prevent HARKing and cherry-picking. This file must not be edited after data collection begins (amendments append a dated note, never overwrite).

---

## Conflict of Interest

UIKode authors `@uikode/tide`. This is a vendor benchmark. Mitigations: competitor libraries configured per their official best-practice docs; raw data + scripts published; distribution-aware stats; threats-to-validity disclosed.

---

## Research Questions & Hypotheses (locked)

| ID | Question | Hypothesis | Primary metric |
|----|----------|------------|----------------|
| RQ1 | Shipped bundle size? | Tide ≤ TanStack; Tide ≈ solid-swr+extras | gzip + brotli bytes (solid-js external) |
| RQ2 | Cached revisit render speed? | Tide (sync sessionStorage) < TanStack/swr (async) | Revisit TTDP (ms) |
| RQ3 | Cold first paint? | Comparable (same backend) | FCP + Cold TTDP (ms) |
| RQ4 | Real-time update cost? | Tide native WS < competitor manual adapter | Update→DOM (ms) + integration LOC/deps |
| RQ5 | Steady-state resource use? | Exploratory (no direction) | JS heap (MB), long-task count |

## Metric Definitions (locked)

- **Bundle:** minified lib entry + non-peer deps, `solid-js` external; gzip -9 + brotli q11.
- **TTDP:** navigationStart → frame committing real (non-skeleton) data; app `performance.mark('data-painted')` in first effect after data truthy + rAF. Identical insertion point across all harnesses.
- **FCP:** standard paint entry.
- **Revisit TTDP:** TTDP on 2nd visit within session.
- **Cold TTDP:** TTDP after storage/cache cleared + hard reload.
- **Update→DOM:** WS msg received → DOM commit of new value.
- **JS heap:** usedJSHeapSize after 60s idle (Chromium).
- **Integration cost:** LOC + deps to reach WS parity (manual count).

## Experimental Design (locked)

- IV: library ∈ {tide, tanstack, tanstack+persist, solid-swr}
- DV: metrics above
- Controlled: hardware, OS, Chromium build, viewport 1280×800 @ DPR1, backend fixtures, network (localhost/throttle profile), markup/CSS, color scheme, extensions off
- Randomized: interleaved run order; seeded RNG (seed recorded)
- Backend: dedicated frozen-fixture server (:20140), zero variance
- Pages: `/api/daemon/status` (small), `/api/gateways` (medium), `/api/dashboard` (large)

## Statistical Plan (locked)

- Warmup: discard first 3 trials per condition (documented).
- N = 30 measured trials per (library × page × scenario).
- Report: median (p50), p95, p99, IQR, min, n. Means secondary only.
- Tests: Mann-Whitney U (pairwise vs Tide); effect size = Cliff's delta + median diff with bootstrap 95% CI.
- α = 0.05; Holm-Bonferroni for multiple comparisons.
- Outliers: flag > p99, investigate, do NOT silently drop; report with/without if removed.
- Visualization: box/violin plots (distribution), colorblind-safe, n shown.

## Amendment Log

_(append dated entries here if the protocol must change; never overwrite the above)_
