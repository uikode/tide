# Tide benchmark — analysis

Generated 2026-06-09T02:38:46.141Z from `results.csv`.
Warmup trials discarded. Lower is better for all latency/size metrics.

Profiles: local-fast · arms: vanilla, tide, tanstack, swr · pages: 7.
Latest run: seed=704675318, N=30 (+3 warmup), tide `19402bdd0`.

---

## Profile: local-fast

### cold · fcp_ms

| page | arm | n | median | p95 | p99 | IQR | min | max |
|---|---|--:|--:|--:|--:|--:|--:|--:|
| announcements | vanilla | 10 | 41.25 | 80.55 | 103.55 | 8.37 | 31.20 | 109.30 |
| announcements | tide | 13 | 36.90 | 56.10 | 58.98 | 5.50 | 25.20 | 59.70 |
| announcements | tanstack | 17 | 36.60 | 45.90 | 49.10 | 7.60 | 23.80 | 49.90 |
| announcements | swr | 13 | 33.60 | 64.66 | 77.09 | 8.40 | 23.80 | 80.20 |
| tooling | vanilla | 13 | 35.50 | 43.08 | 46.30 | 6.60 | 25.10 | 47.10 |
| tooling | tide | 12 | 38.65 | 70.99 | 71.08 | 11.68 | 27.70 | 71.10 |
| tooling | tanstack | 14 | 31.55 | 56.28 | 74.38 | 6.97 | 26.80 | 78.90 |
| tooling | swr | 13 | 36.30 | 53.70 | 60.66 | 4.70 | 27.60 | 62.40 |
| stack | vanilla | 18 | 36.60 | 79.90 | 93.98 | 17.88 | 21.50 | 97.50 |
| stack | tide | 17 | 37.50 | 75.02 | 89.80 | 18.30 | 22.80 | 93.50 |
| stack | tanstack | 19 | 34.90 | 56.61 | 58.84 | 10.20 | 29.00 | 59.40 |
| stack | swr | 14 | 36.30 | 55.43 | 58.61 | 9.07 | 25.70 | 59.40 |
| daemon | vanilla | 13 | 35.60 | 47.80 | 48.04 | 5.40 | 27.20 | 48.10 |
| daemon | tide | 15 | 41.50 | 65.64 | 72.25 | 15.05 | 29.20 | 73.90 |
| daemon | tanstack | 17 | 35.70 | 53.60 | 57.44 | 12.60 | 27.70 | 58.40 |
| daemon | swr | 18 | 44.15 | 76.65 | 104.53 | 11.70 | 26.70 | 111.50 |
| gateways | vanilla | 17 | 41.20 | 77.74 | 99.63 | 11.50 | 25.40 | 105.10 |
| gateways | tide | 13 | 39.60 | 56.50 | 62.98 | 10.80 | 30.50 | 64.60 |
| gateways | tanstack | 15 | 43.40 | 58.77 | 60.95 | 14.60 | 31.40 | 61.50 |
| gateways | swr | 13 | 39.40 | 68.64 | 83.09 | 17.90 | 26.80 | 86.70 |
| dashboard | vanilla | 13 | 38.70 | 48.02 | 53.44 | 3.80 | 28.60 | 54.80 |
| dashboard | tide | 13 | 36.80 | 50.76 | 53.11 | 9.90 | 31.20 | 53.70 |
| dashboard | tanstack | 19 | 37.00 | 49.17 | 54.71 | 13.05 | 24.40 | 56.10 |
| dashboard | swr | 18 | 34.10 | 47.95 | 49.99 | 13.90 | 24.00 | 50.50 |
| summary | vanilla | 9 | 42.40 | 70.32 | 71.18 | 24.00 | 29.70 | 71.40 |
| summary | tide | 13 | 38.20 | 45.36 | 46.27 | 4.10 | 27.80 | 46.50 |
| summary | tanstack | 15 | 32.10 | 45.24 | 51.29 | 8.45 | 28.80 | 52.80 |
| summary | swr | 18 | 32.65 | 48.12 | 56.82 | 6.45 | 22.70 | 59.00 |

### cold · ttdp_ms

| page | arm | n | median | p95 | p99 | IQR | min | max |
|---|---|--:|--:|--:|--:|--:|--:|--:|
| announcements | vanilla | 30 | 33.45 | 69.18 | 138.91 | 10.15 | 25.00 | 166.20 |
| announcements | tide | 30 | 33.25 | 67.87 | 100.24 | 12.55 | 19.10 | 112.30 |
| announcements | tanstack | 30 | 40.05 | 68.85 | 96.88 | 16.67 | 24.60 | 107.20 |
| announcements | swr | 30 | 35.75 | 80.67 | 108.94 | 9.58 | 21.50 | 120.40 |
| tooling | vanilla | 30 | 35.10 | 63.20 | 106.44 | 9.68 | 23.10 | 122.10 |
| tooling | tide | 30 | 31.05 | 88.35 | 102.48 | 15.10 | 20.00 | 107.50 |
| tooling | tanstack | 30 | 38.55 | 96.33 | 129.19 | 21.47 | 31.30 | 140.30 |
| tooling | swr | 30 | 37.85 | 83.44 | 96.96 | 6.65 | 22.30 | 100.70 |
| stack | vanilla | 30 | 40.50 | 127.41 | 138.32 | 36.55 | 21.60 | 138.90 |
| stack | tide | 30 | 32.55 | 96.92 | 127.92 | 18.63 | 22.20 | 135.90 |
| stack | tanstack | 30 | 38.70 | 65.64 | 81.38 | 6.52 | 22.00 | 87.30 |
| stack | swr | 30 | 39.00 | 72.82 | 99.03 | 18.93 | 22.30 | 109.30 |
| daemon | vanilla | 30 | 41.85 | 71.29 | 90.42 | 17.82 | 24.00 | 97.70 |
| daemon | tide | 30 | 41.00 | 73.73 | 112.34 | 15.62 | 25.30 | 126.90 |
| daemon | tanstack | 30 | 44.30 | 78.93 | 115.95 | 17.77 | 22.10 | 129.70 |
| daemon | swr | 30 | 48.25 | 90.71 | 102.94 | 28.90 | 21.10 | 107.90 |
| gateways | vanilla | 30 | 35.40 | 99.53 | 120.58 | 19.80 | 21.10 | 128.90 |
| gateways | tide | 30 | 34.00 | 85.74 | 117.83 | 12.40 | 20.60 | 120.50 |
| gateways | tanstack | 30 | 42.00 | 65.28 | 69.17 | 17.25 | 24.70 | 70.10 |
| gateways | swr | 30 | 39.65 | 80.24 | 251.60 | 9.58 | 22.30 | 319.40 |
| dashboard | vanilla | 30 | 33.50 | 59.89 | 134.82 | 12.57 | 23.60 | 164.20 |
| dashboard | tide | 30 | 36.10 | 58.07 | 67.93 | 9.17 | 22.30 | 71.70 |
| dashboard | tanstack | 30 | 39.85 | 119.64 | 170.46 | 14.85 | 32.40 | 179.10 |
| dashboard | swr | 30 | 39.75 | 108.52 | 130.89 | 6.80 | 29.90 | 134.80 |
| summary | vanilla | 30 | 34.55 | 125.90 | 169.52 | 7.25 | 22.30 | 186.60 |
| summary | tide | 30 | 33.80 | 59.07 | 62.61 | 9.40 | 20.90 | 64.00 |
| summary | tanstack | 30 | 39.35 | 121.29 | 148.45 | 14.15 | 23.00 | 152.60 |
| summary | swr | 30 | 40.45 | 101.90 | 136.86 | 25.68 | 22.50 | 149.30 |

### revisit · ttdp_ms

| page | arm | n | median | p95 | p99 | IQR | min | max |
|---|---|--:|--:|--:|--:|--:|--:|--:|
| announcements | vanilla | 30 | 31.05 | 69.54 | 83.04 | 6.38 | 20.30 | 87.10 |
| announcements | tide | 30 | 21.20 | 31.51 | 38.46 | 6.17 | 15.50 | 41.10 |
| announcements | tanstack | 30 | 33.25 | 82.31 | 90.97 | 22.65 | 23.20 | 93.00 |
| announcements | swr | 30 | 31.50 | 77.72 | 92.56 | 16.43 | 21.80 | 95.60 |
| tooling | vanilla | 30 | 25.10 | 105.03 | 199.10 | 6.07 | 17.00 | 220.50 |
| tooling | tide | 30 | 22.75 | 34.90 | 35.37 | 6.13 | 17.60 | 35.40 |
| tooling | tanstack | 30 | 31.50 | 90.88 | 159.69 | 9.50 | 22.90 | 177.00 |
| tooling | swr | 30 | 30.75 | 81.02 | 87.21 | 14.00 | 20.30 | 89.30 |
| stack | vanilla | 30 | 28.95 | 49.68 | 55.91 | 14.35 | 18.10 | 58.00 |
| stack | tide | 30 | 21.90 | 36.44 | 40.14 | 9.40 | 15.80 | 41.30 |
| stack | tanstack | 30 | 32.10 | 47.74 | 55.15 | 9.10 | 20.20 | 57.30 |
| stack | swr | 30 | 28.05 | 62.88 | 66.72 | 10.23 | 19.70 | 68.20 |
| daemon | vanilla | 30 | 29.90 | 86.68 | 107.62 | 9.28 | 17.40 | 111.10 |
| daemon | tide | 30 | 22.60 | 35.26 | 37.79 | 8.98 | 17.00 | 38.40 |
| daemon | tanstack | 30 | 29.05 | 58.42 | 66.36 | 8.40 | 19.00 | 66.80 |
| daemon | swr | 30 | 31.25 | 64.62 | 153.36 | 13.50 | 18.50 | 188.80 |
| gateways | vanilla | 30 | 30.10 | 84.22 | 113.97 | 10.08 | 18.30 | 117.60 |
| gateways | tide | 30 | 23.70 | 30.99 | 33.71 | 7.55 | 17.00 | 34.70 |
| gateways | tanstack | 30 | 31.80 | 71.45 | 76.21 | 14.47 | 20.80 | 77.60 |
| gateways | swr | 30 | 29.50 | 87.98 | 108.12 | 12.05 | 19.10 | 108.70 |
| dashboard | vanilla | 30 | 32.55 | 97.30 | 111.74 | 13.50 | 19.00 | 114.90 |
| dashboard | tide | 30 | 24.45 | 32.31 | 35.31 | 8.00 | 17.20 | 36.50 |
| dashboard | tanstack | 30 | 33.55 | 78.60 | 135.76 | 15.38 | 22.60 | 158.00 |
| dashboard | swr | 30 | 30.55 | 40.67 | 40.94 | 6.95 | 22.90 | 41.00 |
| summary | vanilla | 30 | 27.60 | 37.86 | 51.46 | 7.53 | 18.90 | 56.80 |
| summary | tide | 30 | 21.30 | 41.79 | 53.07 | 11.45 | 15.90 | 55.30 |
| summary | tanstack | 30 | 33.25 | 79.35 | 118.57 | 15.60 | 23.00 | 133.50 |
| summary | swr | 30 | 34.30 | 76.01 | 247.10 | 26.43 | 19.80 | 314.90 |

### update · update_to_dom_ms

| page | arm | n | median | p95 | p99 | IQR | min | max |
|---|---|--:|--:|--:|--:|--:|--:|--:|
| announcements | vanilla | 30 | 6.55 | 17.38 | 26.50 | 9.03 | 0.40 | 29.20 |
| announcements | tide | 28 | 11.30 | 23.61 | 24.47 | 9.63 | 0.30 | 24.60 |
| announcements | tanstack | 30 | 5.35 | 16.47 | 17.67 | 7.45 | 0.70 | 18.10 |
| announcements | swr | 30 | 5.85 | 20.36 | 21.35 | 9.35 | 0.50 | 21.70 |
| tooling | vanilla | 30 | 2.65 | 9.87 | 19.80 | 2.98 | 0.50 | 23.60 |
| tooling | tide | 28 | 4.05 | 15.69 | 19.50 | 5.97 | 0.50 | 19.80 |
| tooling | tanstack | 30 | 2.10 | 17.30 | 23.03 | 5.42 | 1.00 | 24.80 |
| tooling | swr | 30 | 5.00 | 18.09 | 21.24 | 7.55 | 1.10 | 22.20 |
| stack | vanilla | 30 | 4.60 | 22.36 | 25.53 | 9.33 | 0.60 | 26.40 |
| stack | tide | 29 | 3.20 | 17.94 | 21.48 | 8.20 | 0.40 | 22.40 |
| stack | tanstack | 30 | 6.20 | 20.43 | 23.71 | 8.55 | 1.00 | 24.00 |
| stack | swr | 30 | 6.50 | 15.66 | 20.93 | 6.18 | 0.50 | 22.70 |
| daemon | vanilla | 30 | 8.20 | 21.98 | 23.27 | 8.25 | 0.90 | 23.70 |
| daemon | tide | 30 | 2.70 | 21.29 | 24.66 | 11.97 | 0.70 | 25.70 |
| daemon | tanstack | 30 | 3.60 | 14.90 | 17.17 | 8.95 | 1.70 | 18.10 |
| daemon | swr | 30 | 2.80 | 16.14 | 20.52 | 10.53 | 0.60 | 22.00 |
| gateways | vanilla | 30 | 5.40 | 19.02 | 21.33 | 11.90 | 0.70 | 22.20 |
| gateways | tide | 29 | 2.20 | 20.72 | 22.86 | 10.60 | 0.50 | 23.20 |
| gateways | tanstack | 30 | 3.15 | 20.22 | 22.84 | 5.03 | 1.70 | 23.30 |
| gateways | swr | 30 | 5.50 | 19.95 | 22.77 | 10.82 | 1.20 | 23.90 |
| dashboard | vanilla | 30 | 3.50 | 17.92 | 20.14 | 5.78 | 1.20 | 20.60 |
| dashboard | tide | 30 | 2.60 | 14.95 | 18.34 | 8.95 | 1.30 | 19.70 |
| dashboard | tanstack | 30 | 6.25 | 18.22 | 21.00 | 7.07 | 3.00 | 21.90 |
| dashboard | swr | 30 | 7.30 | 12.94 | 17.92 | 1.40 | 5.50 | 19.80 |
| summary | vanilla | 30 | 5.05 | 15.34 | 21.26 | 6.52 | 0.60 | 23.00 |
| summary | tide | 30 | 2.40 | 21.21 | 22.27 | 5.00 | 0.60 | 22.50 |
| summary | tanstack | 30 | 5.95 | 23.31 | 24.61 | 11.05 | 1.30 | 25.10 |
| summary | swr | 30 | 4.35 | 23.91 | 25.11 | 9.88 | 1.00 | 25.40 |

### steady · js_heap_mb

| page | arm | n | median | p95 | p99 | IQR | min | max |
|---|---|--:|--:|--:|--:|--:|--:|--:|
| announcements | vanilla | 30 | 3.10 | 3.11 | 3.11 | 0.26 | 2.82 | 3.11 |
| announcements | tide | 30 | 3.15 | 3.17 | 3.19 | 0.02 | 3.14 | 3.20 |
| announcements | tanstack | 30 | 3.52 | 3.55 | 3.56 | 0.02 | 3.49 | 3.56 |
| announcements | swr | 30 | 3.25 | 3.27 | 3.29 | 0.01 | 3.22 | 3.29 |
| tooling | vanilla | 30 | 3.15 | 3.19 | 3.22 | 0.02 | 2.87 | 3.22 |
| tooling | tide | 30 | 3.23 | 3.25 | 3.27 | 0.02 | 3.21 | 3.28 |
| tooling | tanstack | 30 | 3.64 | 3.67 | 3.77 | 0.02 | 3.61 | 3.81 |
| tooling | swr | 30 | 3.37 | 3.41 | 3.43 | 0.02 | 3.34 | 3.43 |
| stack | vanilla | 30 | 3.12 | 3.16 | 3.19 | 0.02 | 3.10 | 3.20 |
| stack | tide | 30 | 3.21 | 3.25 | 3.28 | 0.01 | 3.18 | 3.29 |
| stack | tanstack | 30 | 3.60 | 4.01 | 4.03 | 0.05 | 3.57 | 4.04 |
| stack | swr | 30 | 3.30 | 3.32 | 3.32 | 0.01 | 3.28 | 3.32 |
| daemon | vanilla | 30 | 3.33 | 3.34 | 3.34 | 0.01 | 3.31 | 3.34 |
| daemon | tide | 30 | 3.41 | 3.45 | 3.46 | 0.02 | 3.39 | 3.46 |
| daemon | tanstack | 30 | 4.01 | 4.02 | 4.03 | 0.02 | 3.89 | 4.03 |
| daemon | swr | 30 | 3.61 | 3.67 | 3.68 | 0.10 | 3.52 | 3.68 |
| gateways | vanilla | 30 | 3.22 | 3.25 | 3.25 | 0.02 | 3.21 | 3.25 |
| gateways | tide | 30 | 3.33 | 3.35 | 3.37 | 0.02 | 3.30 | 3.38 |
| gateways | tanstack | 30 | 3.93 | 3.95 | 3.95 | 0.02 | 3.91 | 3.96 |
| gateways | swr | 30 | 3.62 | 3.64 | 3.64 | 0.03 | 3.52 | 3.64 |
| dashboard | vanilla | 30 | 3.55 | 3.57 | 3.58 | 0.01 | 3.54 | 3.58 |
| dashboard | tide | 30 | 4.25 | 4.25 | 4.25 | 0.09 | 4.16 | 4.25 |
| dashboard | tanstack | 30 | 3.87 | 4.21 | 4.28 | 0.36 | 3.81 | 4.31 |
| dashboard | swr | 30 | 3.44 | 4.43 | 4.89 | 0.02 | 3.41 | 4.90 |
| summary | vanilla | 30 | 3.17 | 3.21 | 3.24 | 0.02 | 3.16 | 3.24 |
| summary | tide | 30 | 3.27 | 3.30 | 3.31 | 0.02 | 3.24 | 3.31 |
| summary | tanstack | 30 | 3.73 | 3.85 | 3.86 | 0.11 | 3.68 | 3.86 |
| summary | swr | 30 | 3.53 | 3.57 | 3.57 | 0.11 | 3.40 | 3.57 |

### steady · long_tasks

| page | arm | n | median | p95 | p99 | IQR | min | max |
|---|---|--:|--:|--:|--:|--:|--:|--:|
| announcements | vanilla | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| announcements | tide | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| announcements | tanstack | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| announcements | swr | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| tooling | vanilla | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| tooling | tide | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| tooling | tanstack | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| tooling | swr | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| stack | vanilla | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| stack | tide | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| stack | tanstack | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| stack | swr | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| daemon | vanilla | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| daemon | tide | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| daemon | tanstack | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| daemon | swr | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| gateways | vanilla | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| gateways | tide | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| gateways | tanstack | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| gateways | swr | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| dashboard | vanilla | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| dashboard | tide | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| dashboard | tanstack | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| dashboard | swr | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| summary | vanilla | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| summary | tide | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| summary | tanstack | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| summary | swr | 30 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |

---

## Significance — Tide vs competitors (Mann-Whitney U, Holm-Bonferroni per profile, α=0.05)

| profile | scenario | metric | page | vs | med Tide | med comp | Cliff's δ | mag | p(adj) | sig |
|---|---|---|---|---|--:|--:|--:|---|--:|:--:|
| local-fast | cold | ttdp_ms | announcements | vanilla | 33.25 | 33.45 | -0.03 | negligible | 1.0000 |  |
| local-fast | cold | ttdp_ms | announcements | tanstack | 33.25 | 40.05 | -0.42 | medium | 0.4785 |  |
| local-fast | cold | ttdp_ms | announcements | swr | 33.25 | 35.75 | -0.12 | negligible | 1.0000 |  |
| local-fast | cold | ttdp_ms | tooling | vanilla | 31.05 | 35.10 | -0.25 | small | 1.0000 |  |
| local-fast | cold | ttdp_ms | tooling | tanstack | 31.05 | 38.55 | -0.48 | large | 0.1240 |  |
| local-fast | cold | ttdp_ms | tooling | swr | 31.05 | 37.85 | -0.32 | small | 1.0000 |  |
| local-fast | cold | ttdp_ms | stack | vanilla | 32.55 | 40.50 | -0.22 | small | 1.0000 |  |
| local-fast | cold | ttdp_ms | stack | tanstack | 32.55 | 38.70 | -0.24 | small | 1.0000 |  |
| local-fast | cold | ttdp_ms | stack | swr | 32.55 | 39.00 | -0.32 | small | 1.0000 |  |
| local-fast | cold | ttdp_ms | daemon | vanilla | 41.00 | 41.85 | 0.03 | negligible | 1.0000 |  |
| local-fast | cold | ttdp_ms | daemon | tanstack | 41.00 | 44.30 | -0.05 | negligible | 1.0000 |  |
| local-fast | cold | ttdp_ms | daemon | swr | 41.00 | 48.25 | -0.18 | small | 1.0000 |  |
| local-fast | cold | ttdp_ms | gateways | vanilla | 34.00 | 35.40 | -0.25 | small | 1.0000 |  |
| local-fast | cold | ttdp_ms | gateways | tanstack | 34.00 | 42.00 | -0.53 | large | 0.0408 | ✓ |
| local-fast | cold | ttdp_ms | gateways | swr | 34.00 | 39.65 | -0.45 | medium | 0.2338 |  |
| local-fast | cold | ttdp_ms | dashboard | vanilla | 36.10 | 33.50 | 0.12 | negligible | 1.0000 |  |
| local-fast | cold | ttdp_ms | dashboard | tanstack | 36.10 | 39.85 | -0.39 | medium | 0.7656 |  |
| local-fast | cold | ttdp_ms | dashboard | swr | 36.10 | 39.75 | -0.27 | small | 1.0000 |  |
| local-fast | cold | ttdp_ms | summary | vanilla | 33.80 | 34.55 | -0.10 | negligible | 1.0000 |  |
| local-fast | cold | ttdp_ms | summary | tanstack | 33.80 | 39.35 | -0.31 | small | 1.0000 |  |
| local-fast | cold | ttdp_ms | summary | swr | 33.80 | 40.45 | -0.41 | medium | 0.5412 |  |
| local-fast | cold | fcp_ms | announcements | vanilla | 36.90 | 41.25 | -0.33 | medium | 1.0000 |  |
| local-fast | cold | fcp_ms | announcements | tanstack | 36.90 | 36.60 | -0.01 | negligible | 1.0000 |  |
| local-fast | cold | fcp_ms | announcements | swr | 36.90 | 33.60 | 0.26 | small | 1.0000 |  |
| local-fast | cold | fcp_ms | tooling | vanilla | 38.65 | 35.50 | 0.33 | medium | 1.0000 |  |
| local-fast | cold | fcp_ms | tooling | tanstack | 38.65 | 31.55 | 0.34 | medium | 1.0000 |  |
| local-fast | cold | fcp_ms | tooling | swr | 38.65 | 36.30 | 0.24 | small | 1.0000 |  |
| local-fast | cold | fcp_ms | stack | vanilla | 37.50 | 36.60 | 0.13 | negligible | 1.0000 |  |
| local-fast | cold | fcp_ms | stack | tanstack | 37.50 | 34.90 | 0.14 | negligible | 1.0000 |  |
| local-fast | cold | fcp_ms | stack | swr | 37.50 | 36.30 | 0.13 | negligible | 1.0000 |  |
| local-fast | cold | fcp_ms | daemon | vanilla | 41.50 | 35.60 | 0.24 | small | 1.0000 |  |
| local-fast | cold | fcp_ms | daemon | tanstack | 41.50 | 35.70 | 0.16 | small | 1.0000 |  |
| local-fast | cold | fcp_ms | daemon | swr | 41.50 | 44.15 | -0.15 | small | 1.0000 |  |
| local-fast | cold | fcp_ms | gateways | vanilla | 39.60 | 41.20 | -0.10 | negligible | 1.0000 |  |
| local-fast | cold | fcp_ms | gateways | tanstack | 39.60 | 43.40 | -0.25 | small | 1.0000 |  |
| local-fast | cold | fcp_ms | gateways | swr | 39.60 | 39.40 | -0.01 | negligible | 1.0000 |  |
| local-fast | cold | fcp_ms | dashboard | vanilla | 36.80 | 38.70 | -0.15 | small | 1.0000 |  |
| local-fast | cold | fcp_ms | dashboard | tanstack | 36.80 | 37.00 | 0.11 | negligible | 1.0000 |  |
| local-fast | cold | fcp_ms | dashboard | swr | 36.80 | 34.10 | 0.16 | small | 1.0000 |  |
| local-fast | cold | fcp_ms | summary | vanilla | 38.20 | 42.40 | -0.13 | negligible | 1.0000 |  |
| local-fast | cold | fcp_ms | summary | tanstack | 38.20 | 32.10 | 0.39 | medium | 1.0000 |  |
| local-fast | cold | fcp_ms | summary | swr | 38.20 | 32.65 | 0.47 | medium | 1.0000 |  |
| local-fast | revisit | ttdp_ms | announcements | vanilla | 21.20 | 31.05 | -0.77 | large | 0.0000 | ✓ |
| local-fast | revisit | ttdp_ms | announcements | tanstack | 21.20 | 33.25 | -0.80 | large | 0.0000 | ✓ |
| local-fast | revisit | ttdp_ms | announcements | swr | 21.20 | 31.50 | -0.74 | large | 0.0001 | ✓ |
| local-fast | revisit | ttdp_ms | tooling | vanilla | 22.75 | 25.10 | -0.30 | small | 1.0000 |  |
| local-fast | revisit | ttdp_ms | tooling | tanstack | 22.75 | 31.50 | -0.74 | large | 0.0001 | ✓ |
| local-fast | revisit | ttdp_ms | tooling | swr | 22.75 | 30.75 | -0.67 | large | 0.0008 | ✓ |
| local-fast | revisit | ttdp_ms | stack | vanilla | 21.90 | 28.95 | -0.40 | medium | 0.6243 |  |
| local-fast | revisit | ttdp_ms | stack | tanstack | 21.90 | 32.10 | -0.62 | large | 0.0034 | ✓ |
| local-fast | revisit | ttdp_ms | stack | swr | 21.90 | 28.05 | -0.53 | large | 0.0349 | ✓ |
| local-fast | revisit | ttdp_ms | daemon | vanilla | 22.60 | 29.90 | -0.57 | large | 0.0122 | ✓ |
| local-fast | revisit | ttdp_ms | daemon | tanstack | 22.60 | 29.05 | -0.51 | large | 0.0659 |  |
| local-fast | revisit | ttdp_ms | daemon | swr | 22.60 | 31.25 | -0.58 | large | 0.0114 | ✓ |
| local-fast | revisit | ttdp_ms | gateways | vanilla | 23.70 | 30.10 | -0.57 | large | 0.0153 | ✓ |
| local-fast | revisit | ttdp_ms | gateways | tanstack | 23.70 | 31.80 | -0.63 | large | 0.0028 | ✓ |
| local-fast | revisit | ttdp_ms | gateways | swr | 23.70 | 29.50 | -0.50 | large | 0.0725 |  |
| local-fast | revisit | ttdp_ms | dashboard | vanilla | 24.45 | 32.55 | -0.61 | large | 0.0043 | ✓ |
| local-fast | revisit | ttdp_ms | dashboard | tanstack | 24.45 | 33.55 | -0.66 | large | 0.0011 | ✓ |
| local-fast | revisit | ttdp_ms | dashboard | swr | 24.45 | 30.55 | -0.65 | large | 0.0014 | ✓ |
| local-fast | revisit | ttdp_ms | summary | vanilla | 21.30 | 27.60 | -0.37 | medium | 1.0000 |  |
| local-fast | revisit | ttdp_ms | summary | tanstack | 21.30 | 33.25 | -0.69 | large | 0.0005 | ✓ |
| local-fast | revisit | ttdp_ms | summary | swr | 21.30 | 34.30 | -0.58 | large | 0.0120 | ✓ |
| local-fast | update | update_to_dom_ms | announcements | vanilla | 11.30 | 6.55 | 0.34 | medium | 1.0000 |  |
| local-fast | update | update_to_dom_ms | announcements | tanstack | 11.30 | 5.35 | 0.31 | small | 1.0000 |  |
| local-fast | update | update_to_dom_ms | announcements | swr | 11.30 | 5.85 | 0.30 | small | 1.0000 |  |
| local-fast | update | update_to_dom_ms | tooling | vanilla | 4.05 | 2.65 | 0.07 | negligible | 1.0000 |  |
| local-fast | update | update_to_dom_ms | tooling | tanstack | 4.05 | 2.10 | -0.11 | negligible | 1.0000 |  |
| local-fast | update | update_to_dom_ms | tooling | swr | 4.05 | 5.00 | -0.25 | small | 1.0000 |  |
| local-fast | update | update_to_dom_ms | stack | vanilla | 3.20 | 4.60 | -0.10 | negligible | 1.0000 |  |
| local-fast | update | update_to_dom_ms | stack | tanstack | 3.20 | 6.20 | -0.25 | small | 1.0000 |  |
| local-fast | update | update_to_dom_ms | stack | swr | 3.20 | 6.50 | -0.22 | small | 1.0000 |  |
| local-fast | update | update_to_dom_ms | daemon | vanilla | 2.70 | 8.20 | -0.24 | small | 1.0000 |  |
| local-fast | update | update_to_dom_ms | daemon | tanstack | 2.70 | 3.60 | -0.16 | small | 1.0000 |  |
| local-fast | update | update_to_dom_ms | daemon | swr | 2.70 | 2.80 | -0.06 | negligible | 1.0000 |  |
| local-fast | update | update_to_dom_ms | gateways | vanilla | 2.20 | 5.40 | -0.12 | negligible | 1.0000 |  |
| local-fast | update | update_to_dom_ms | gateways | tanstack | 2.20 | 3.15 | -0.22 | small | 1.0000 |  |
| local-fast | update | update_to_dom_ms | gateways | swr | 2.20 | 5.50 | -0.24 | small | 1.0000 |  |
| local-fast | update | update_to_dom_ms | dashboard | vanilla | 2.60 | 3.50 | -0.10 | negligible | 1.0000 |  |
| local-fast | update | update_to_dom_ms | dashboard | tanstack | 2.60 | 6.25 | -0.38 | medium | 0.9970 |  |
| local-fast | update | update_to_dom_ms | dashboard | swr | 2.60 | 7.30 | -0.33 | medium | 1.0000 |  |
| local-fast | update | update_to_dom_ms | summary | vanilla | 2.40 | 5.05 | -0.11 | negligible | 1.0000 |  |
| local-fast | update | update_to_dom_ms | summary | tanstack | 2.40 | 5.95 | -0.37 | medium | 1.0000 |  |
| local-fast | update | update_to_dom_ms | summary | swr | 2.40 | 4.35 | -0.22 | small | 1.0000 |  |
| local-fast | steady | js_heap_mb | announcements | vanilla | 3.15 | 3.10 | 1.00 | large | 0.0000 | ✓ |
| local-fast | steady | js_heap_mb | announcements | tanstack | 3.15 | 3.52 | -1.00 | large | 0.0000 | ✓ |
| local-fast | steady | js_heap_mb | announcements | swr | 3.15 | 3.25 | -1.00 | large | 0.0000 | ✓ |
| local-fast | steady | js_heap_mb | tooling | vanilla | 3.23 | 3.15 | 0.98 | large | 0.0000 | ✓ |
| local-fast | steady | js_heap_mb | tooling | tanstack | 3.23 | 3.64 | -1.00 | large | 0.0000 | ✓ |
| local-fast | steady | js_heap_mb | tooling | swr | 3.23 | 3.37 | -1.00 | large | 0.0000 | ✓ |
| local-fast | steady | js_heap_mb | stack | vanilla | 3.21 | 3.12 | 0.98 | large | 0.0000 | ✓ |
| local-fast | steady | js_heap_mb | stack | tanstack | 3.21 | 3.60 | -1.00 | large | 0.0000 | ✓ |
| local-fast | steady | js_heap_mb | stack | swr | 3.21 | 3.30 | -0.97 | large | 0.0000 | ✓ |
| local-fast | steady | js_heap_mb | daemon | vanilla | 3.41 | 3.33 | 1.00 | large | 0.0000 | ✓ |
| local-fast | steady | js_heap_mb | daemon | tanstack | 3.41 | 4.01 | -1.00 | large | 0.0000 | ✓ |
| local-fast | steady | js_heap_mb | daemon | swr | 3.41 | 3.61 | -1.00 | large | 0.0000 | ✓ |
| local-fast | steady | js_heap_mb | gateways | vanilla | 3.33 | 3.22 | 1.00 | large | 0.0000 | ✓ |
| local-fast | steady | js_heap_mb | gateways | tanstack | 3.33 | 3.93 | -1.00 | large | 0.0000 | ✓ |
| local-fast | steady | js_heap_mb | gateways | swr | 3.33 | 3.62 | -1.00 | large | 0.0000 | ✓ |
| local-fast | steady | js_heap_mb | dashboard | vanilla | 4.25 | 3.55 | 1.00 | large | 0.0000 | ✓ |
| local-fast | steady | js_heap_mb | dashboard | tanstack | 4.25 | 3.87 | 0.64 | large | 0.0018 | ✓ |
| local-fast | steady | js_heap_mb | dashboard | swr | 4.25 | 3.44 | 0.87 | large | 0.0000 | ✓ |
| local-fast | steady | js_heap_mb | summary | vanilla | 3.27 | 3.17 | 1.00 | large | 0.0000 | ✓ |
| local-fast | steady | js_heap_mb | summary | tanstack | 3.27 | 3.73 | -1.00 | large | 0.0000 | ✓ |
| local-fast | steady | js_heap_mb | summary | swr | 3.27 | 3.53 | -1.00 | large | 0.0000 | ✓ |
| local-fast | steady | long_tasks | announcements | vanilla | 0.00 | 0.00 | 0.00 | negligible | 1.0000 |  |
| local-fast | steady | long_tasks | announcements | tanstack | 0.00 | 0.00 | 0.00 | negligible | 1.0000 |  |
| local-fast | steady | long_tasks | announcements | swr | 0.00 | 0.00 | 0.00 | negligible | 1.0000 |  |
| local-fast | steady | long_tasks | tooling | vanilla | 0.00 | 0.00 | 0.00 | negligible | 1.0000 |  |
| local-fast | steady | long_tasks | tooling | tanstack | 0.00 | 0.00 | 0.00 | negligible | 1.0000 |  |
| local-fast | steady | long_tasks | tooling | swr | 0.00 | 0.00 | 0.00 | negligible | 1.0000 |  |
| local-fast | steady | long_tasks | stack | vanilla | 0.00 | 0.00 | 0.00 | negligible | 1.0000 |  |
| local-fast | steady | long_tasks | stack | tanstack | 0.00 | 0.00 | 0.00 | negligible | 1.0000 |  |
| local-fast | steady | long_tasks | stack | swr | 0.00 | 0.00 | 0.00 | negligible | 1.0000 |  |
| local-fast | steady | long_tasks | daemon | vanilla | 0.00 | 0.00 | 0.00 | negligible | 1.0000 |  |
| local-fast | steady | long_tasks | daemon | tanstack | 0.00 | 0.00 | 0.00 | negligible | 1.0000 |  |
| local-fast | steady | long_tasks | daemon | swr | 0.00 | 0.00 | 0.00 | negligible | 1.0000 |  |
| local-fast | steady | long_tasks | gateways | vanilla | 0.00 | 0.00 | 0.00 | negligible | 1.0000 |  |
| local-fast | steady | long_tasks | gateways | tanstack | 0.00 | 0.00 | 0.00 | negligible | 1.0000 |  |
| local-fast | steady | long_tasks | gateways | swr | 0.00 | 0.00 | 0.00 | negligible | 1.0000 |  |
| local-fast | steady | long_tasks | dashboard | vanilla | 0.00 | 0.00 | 0.00 | negligible | 1.0000 |  |
| local-fast | steady | long_tasks | dashboard | tanstack | 0.00 | 0.00 | 0.00 | negligible | 1.0000 |  |
| local-fast | steady | long_tasks | dashboard | swr | 0.00 | 0.00 | 0.00 | negligible | 1.0000 |  |
| local-fast | steady | long_tasks | summary | vanilla | 0.00 | 0.00 | 0.00 | negligible | 1.0000 |  |
| local-fast | steady | long_tasks | summary | tanstack | 0.00 | 0.00 | 0.00 | negligible | 1.0000 |  |
| local-fast | steady | long_tasks | summary | swr | 0.00 | 0.00 | 0.00 | negligible | 1.0000 |  |
