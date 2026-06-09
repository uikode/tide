# Tide benchmark — analysis

Generated 2026-06-09T00:48:15.992Z from `results.csv`.
Warmup trials discarded. Lower is better for all latency/size metrics.

**Run:** seed=700782595, N=30 (+3 warmup), CPU throttle=1x, tide commit `9fd7490e4`.

## Descriptive statistics (ms unless noted)


### cold · fcp_ms

| page | harness | n | median | p95 | p99 | IQR | min | max |
|---|---|--:|--:|--:|--:|--:|--:|--:|
| daemon | tide | 10 | 38.70 | 55.59 | 57.68 | 11.45 | 26.80 | 58.20 |
| daemon | tanstack | 14 | 38.85 | 42.58 | 42.83 | 5.88 | 28.50 | 42.90 |
| daemon | swr | 14 | 34.45 | 46.95 | 52.67 | 10.62 | 25.60 | 54.10 |
| stack | tide | 12 | 33.50 | 45.32 | 49.07 | 9.85 | 24.00 | 50.00 |
| stack | tanstack | 10 | 34.70 | 41.48 | 42.06 | 5.42 | 27.90 | 42.20 |
| stack | swr | 8 | 36.95 | 41.76 | 42.43 | 10.32 | 20.70 | 42.60 |
| gateways | tide | 10 | 35.50 | 51.19 | 52.96 | 10.55 | 25.40 | 53.40 |
| gateways | tanstack | 16 | 31.95 | 47.43 | 48.20 | 7.25 | 27.70 | 48.40 |
| gateways | swr | 12 | 35.55 | 49.44 | 49.57 | 12.57 | 26.50 | 49.60 |
| dashboard | tide | 14 | 39.20 | 47.77 | 48.75 | 5.82 | 26.70 | 49.00 |
| dashboard | tanstack | 12 | 30.75 | 50.72 | 53.18 | 9.78 | 26.30 | 53.80 |
| dashboard | swr | 13 | 25.60 | 35.36 | 37.71 | 7.30 | 22.80 | 38.30 |

### cold · ttdp_ms

| page | harness | n | median | p95 | p99 | IQR | min | max |
|---|---|--:|--:|--:|--:|--:|--:|--:|
| daemon | tide | 30 | 36.80 | 65.33 | 99.14 | 7.28 | 28.50 | 111.90 |
| daemon | tanstack | 30 | 37.90 | 68.72 | 84.20 | 13.75 | 23.10 | 84.40 |
| daemon | swr | 30 | 34.55 | 80.79 | 120.82 | 8.70 | 21.10 | 137.00 |
| stack | tide | 30 | 30.10 | 82.09 | 111.72 | 6.20 | 18.80 | 113.20 |
| stack | tanstack | 30 | 36.95 | 65.47 | 123.64 | 7.65 | 24.00 | 142.20 |
| stack | swr | 30 | 33.35 | 62.38 | 104.05 | 8.02 | 25.00 | 119.30 |
| gateways | tide | 30 | 30.10 | 77.90 | 100.84 | 10.83 | 20.20 | 108.00 |
| gateways | tanstack | 30 | 36.70 | 52.60 | 62.54 | 5.50 | 28.90 | 65.50 |
| gateways | swr | 30 | 33.85 | 73.61 | 123.76 | 18.65 | 22.40 | 141.10 |
| dashboard | tide | 30 | 33.20 | 42.51 | 67.99 | 7.27 | 22.10 | 78.20 |
| dashboard | tanstack | 30 | 39.15 | 110.93 | 119.79 | 6.10 | 25.60 | 123.30 |
| dashboard | swr | 30 | 35.65 | 61.68 | 102.74 | 4.20 | 24.90 | 114.80 |

### revisit · ttdp_ms

| page | harness | n | median | p95 | p99 | IQR | min | max |
|---|---|--:|--:|--:|--:|--:|--:|--:|
| daemon | tide | 30 | 22.45 | 27.42 | 35.27 | 6.55 | 15.90 | 38.40 |
| daemon | tanstack | 30 | 27.15 | 36.91 | 48.55 | 7.18 | 19.90 | 53.10 |
| daemon | swr | 30 | 26.50 | 36.39 | 63.09 | 10.80 | 18.30 | 73.50 |
| stack | tide | 30 | 19.10 | 26.57 | 27.51 | 7.15 | 13.80 | 27.80 |
| stack | tanstack | 30 | 29.55 | 55.45 | 83.95 | 10.20 | 19.60 | 94.30 |
| stack | swr | 30 | 27.75 | 54.92 | 62.27 | 9.08 | 16.70 | 65.20 |
| gateways | tide | 30 | 20.70 | 26.34 | 27.31 | 4.90 | 14.40 | 27.40 |
| gateways | tanstack | 30 | 28.25 | 98.93 | 151.52 | 10.67 | 19.10 | 165.70 |
| gateways | swr | 30 | 27.55 | 56.21 | 67.93 | 9.72 | 18.40 | 68.80 |
| dashboard | tide | 30 | 19.15 | 27.77 | 28.14 | 6.95 | 15.60 | 28.20 |
| dashboard | tanstack | 30 | 29.00 | 42.51 | 75.19 | 4.55 | 22.70 | 85.40 |
| dashboard | swr | 30 | 30.35 | 48.34 | 52.51 | 7.35 | 21.30 | 53.90 |

### update · update_to_dom_ms

| page | harness | n | median | p95 | p99 | IQR | min | max |
|---|---|--:|--:|--:|--:|--:|--:|--:|
| daemon | tide | 30 | 6.00 | 14.35 | 15.01 | 7.80 | 0.50 | 15.10 |
| daemon | tanstack | 30 | 4.95 | 11.53 | 14.50 | 6.75 | 1.40 | 15.60 |
| daemon | swr | 30 | 6.70 | 11.94 | 13.84 | 7.62 | 0.70 | 14.10 |
| stack | tide | 27 | 6.50 | 12.48 | 12.82 | 6.65 | 0.60 | 12.90 |
| stack | tanstack | 30 | 6.60 | 12.87 | 13.81 | 5.68 | 0.80 | 14.10 |
| stack | swr | 30 | 7.00 | 10.26 | 10.61 | 4.57 | 0.60 | 10.70 |
| gateways | tide | 27 | 4.90 | 10.97 | 11.67 | 6.90 | 0.60 | 11.90 |
| gateways | tanstack | 30 | 4.30 | 14.73 | 16.49 | 5.80 | 1.70 | 16.90 |
| gateways | swr | 30 | 7.10 | 13.47 | 14.69 | 6.70 | 1.20 | 15.10 |
| dashboard | tide | 26 | 6.65 | 13.67 | 14.05 | 5.90 | 1.40 | 14.10 |
| dashboard | tanstack | 30 | 5.05 | 12.05 | 13.97 | 2.75 | 3.30 | 14.20 |
| dashboard | swr | 30 | 6.55 | 10.86 | 13.27 | 1.05 | 5.70 | 14.20 |

### steady · js_heap_mb

| page | harness | n | median | p95 | p99 | IQR | min | max |
|---|---|--:|--:|--:|--:|--:|--:|--:|
| daemon | tide | 30 | 3.35 | 3.38 | 3.40 | 0.01 | 3.33 | 3.41 |
| daemon | tanstack | 30 | 3.93 | 3.94 | 3.95 | 0.12 | 3.79 | 3.96 |
| daemon | swr | 30 | 3.47 | 3.50 | 3.56 | 0.02 | 3.45 | 3.58 |
| stack | tide | 30 | 3.13 | 3.16 | 3.17 | 0.24 | 2.85 | 3.17 |
| stack | tanstack | 30 | 3.53 | 3.54 | 3.56 | 0.02 | 3.50 | 3.57 |
| stack | swr | 30 | 3.23 | 3.27 | 3.28 | 0.03 | 3.22 | 3.29 |
| gateways | tide | 30 | 3.26 | 3.29 | 3.31 | 0.02 | 3.25 | 3.32 |
| gateways | tanstack | 30 | 3.85 | 3.86 | 3.86 | 0.01 | 3.83 | 3.86 |
| gateways | swr | 30 | 3.52 | 3.56 | 3.56 | 0.03 | 3.41 | 3.56 |
| dashboard | tide | 30 | 4.22 | 4.23 | 4.23 | 0.00 | 3.95 | 4.23 |
| dashboard | tanstack | 30 | 3.79 | 3.81 | 4.61 | 0.03 | 3.77 | 4.94 |
| dashboard | swr | 30 | 4.24 | 4.39 | 4.42 | 0.03 | 3.36 | 4.43 |

### steady · long_tasks

| page | harness | n | median | p95 | p99 | IQR | min | max |
|---|---|--:|--:|--:|--:|--:|--:|--:|
| daemon | tide | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| daemon | tanstack | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| daemon | swr | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| stack | tide | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| stack | tanstack | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| stack | swr | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| gateways | tide | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| gateways | tanstack | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| gateways | swr | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| dashboard | tide | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| dashboard | tanstack | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| dashboard | swr | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |

## Significance — Tide vs competitors (Mann-Whitney U, Holm-Bonferroni, α=0.05)

| scenario | metric | page | vs | median Tide | median comp | Cliff's δ | mag | p | p(adj) | sig |
|---|---|---|---|--:|--:|--:|---|--:|--:|:--:|
| cold | ttdp_ms | daemon | tanstack | 36.80 | 37.90 | -0.06 | negligible | 0.6681 | 1.0000 |  |
| cold | ttdp_ms | daemon | swr | 36.80 | 34.55 | 0.15 | small | 0.3182 | 1.0000 |  |
| cold | ttdp_ms | stack | tanstack | 30.10 | 36.95 | -0.49 | large | 0.0012 | 0.0375 | ✓ |
| cold | ttdp_ms | stack | swr | 30.10 | 33.35 | -0.22 | small | 0.1433 | 1.0000 |  |
| cold | ttdp_ms | gateways | tanstack | 30.10 | 36.70 | -0.48 | large | 0.0013 | 0.0393 | ✓ |
| cold | ttdp_ms | gateways | swr | 30.10 | 33.85 | -0.30 | small | 0.0476 | 1.0000 |  |
| cold | ttdp_ms | dashboard | tanstack | 33.20 | 39.15 | -0.64 | large | 0.0000 | 0.0007 | ✓ |
| cold | ttdp_ms | dashboard | swr | 33.20 | 35.65 | -0.46 | medium | 0.0022 | 0.0618 |  |
| cold | fcp_ms | daemon | tanstack | 38.70 | 38.85 | 0.14 | negligible | 0.5779 | 1.0000 |  |
| cold | fcp_ms | daemon | swr | 38.70 | 34.45 | 0.28 | small | 0.2534 | 1.0000 |  |
| cold | fcp_ms | stack | tanstack | 33.50 | 34.70 | -0.07 | negligible | 0.7919 | 1.0000 |  |
| cold | fcp_ms | stack | swr | 33.50 | 36.95 | -0.08 | negligible | 0.7575 | 1.0000 |  |
| cold | fcp_ms | gateways | tanstack | 35.50 | 31.95 | 0.20 | small | 0.3990 | 1.0000 |  |
| cold | fcp_ms | gateways | swr | 35.50 | 35.55 | -0.11 | negligible | 0.6681 | 1.0000 |  |
| cold | fcp_ms | dashboard | tanstack | 39.20 | 30.75 | 0.36 | medium | 0.1228 | 1.0000 |  |
| cold | fcp_ms | dashboard | swr | 39.20 | 25.60 | 0.82 | large | 0.0003 | 0.0090 | ✓ |
| revisit | ttdp_ms | daemon | tanstack | 22.45 | 27.15 | -0.65 | large | 0.0000 | 0.0006 | ✓ |
| revisit | ttdp_ms | daemon | swr | 22.45 | 26.50 | -0.47 | medium | 0.0016 | 0.0475 | ✓ |
| revisit | ttdp_ms | stack | tanstack | 19.10 | 29.55 | -0.78 | large | 0.0000 | 0.0000 | ✓ |
| revisit | ttdp_ms | stack | swr | 19.10 | 27.75 | -0.76 | large | 0.0000 | 0.0000 | ✓ |
| revisit | ttdp_ms | gateways | tanstack | 20.70 | 28.25 | -0.74 | large | 0.0000 | 0.0000 | ✓ |
| revisit | ttdp_ms | gateways | swr | 20.70 | 27.55 | -0.70 | large | 0.0000 | 0.0001 | ✓ |
| revisit | ttdp_ms | dashboard | tanstack | 19.15 | 29.00 | -0.80 | large | 0.0000 | 0.0000 | ✓ |
| revisit | ttdp_ms | dashboard | swr | 19.15 | 30.35 | -0.84 | large | 0.0000 | 0.0000 | ✓ |
| update | update_to_dom_ms | daemon | tanstack | 6.00 | 4.95 | -0.01 | negligible | 0.9352 | 1.0000 |  |
| update | update_to_dom_ms | daemon | swr | 6.00 | 6.70 | 0.02 | negligible | 0.9000 | 1.0000 |  |
| update | update_to_dom_ms | stack | tanstack | 6.50 | 6.60 | -0.13 | negligible | 0.4149 | 1.0000 |  |
| update | update_to_dom_ms | stack | swr | 6.50 | 7.00 | -0.02 | negligible | 0.8730 | 1.0000 |  |
| update | update_to_dom_ms | gateways | tanstack | 4.90 | 4.30 | -0.11 | negligible | 0.4671 | 1.0000 |  |
| update | update_to_dom_ms | gateways | swr | 4.90 | 7.10 | -0.14 | negligible | 0.3622 | 1.0000 |  |
| update | update_to_dom_ms | dashboard | tanstack | 6.65 | 5.05 | 0.09 | negligible | 0.5707 | 1.0000 |  |
| update | update_to_dom_ms | dashboard | swr | 6.65 | 6.55 | -0.02 | negligible | 0.8889 | 1.0000 |  |
| steady | js_heap_mb | daemon | tanstack | 3.35 | 3.93 | -1.00 | large | 0.0000 | 0.0000 | ✓ |
| steady | js_heap_mb | daemon | swr | 3.35 | 3.47 | -1.00 | large | 0.0000 | 0.0000 | ✓ |
| steady | js_heap_mb | stack | tanstack | 3.13 | 3.53 | -1.00 | large | 0.0000 | 0.0000 | ✓ |
| steady | js_heap_mb | stack | swr | 3.13 | 3.23 | -1.00 | large | 0.0000 | 0.0000 | ✓ |
| steady | js_heap_mb | gateways | tanstack | 3.26 | 3.85 | -1.00 | large | 0.0000 | 0.0000 | ✓ |
| steady | js_heap_mb | gateways | swr | 3.26 | 3.52 | -1.00 | large | 0.0000 | 0.0000 | ✓ |
| steady | js_heap_mb | dashboard | tanstack | 4.22 | 3.79 | 0.93 | large | 0.0000 | 0.0000 | ✓ |
| steady | js_heap_mb | dashboard | swr | 4.22 | 4.24 | -0.48 | large | 0.0014 | 0.0419 | ✓ |
| steady | long_tasks | daemon | tanstack | 0.00 | 0.00 | 0.00 | negligible | 1.0000 | 1.0000 |  |
| steady | long_tasks | daemon | swr | 0.00 | 0.00 | 0.00 | negligible | 1.0000 | 1.0000 |  |
| steady | long_tasks | stack | tanstack | 0.00 | 0.00 | 0.00 | negligible | 1.0000 | 1.0000 |  |
| steady | long_tasks | stack | swr | 0.00 | 0.00 | 0.00 | negligible | 1.0000 | 1.0000 |  |
| steady | long_tasks | gateways | tanstack | 0.00 | 0.00 | 0.00 | negligible | 1.0000 | 1.0000 |  |
| steady | long_tasks | gateways | swr | 0.00 | 0.00 | 0.00 | negligible | 1.0000 | 1.0000 |  |
| steady | long_tasks | dashboard | tanstack | 0.00 | 0.00 | 0.00 | negligible | 1.0000 | 1.0000 |  |
| steady | long_tasks | dashboard | swr | 0.00 | 0.00 | 0.00 | negligible | 1.0000 | 1.0000 |  |
