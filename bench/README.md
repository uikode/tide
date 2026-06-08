# Tide Benchmark — Reproduction Guide

Benchmark harness for the white paper *"Real-Time Data on SolidJS — @uikode/tide vs TanStack Query vs solid-swr"*.
See the protocol in `.hermes/plans/2026-06-08_tide-vs-tanstack-real-benchmark.md` and pre-registration in `PREREGISTRATION.md`.

> **No credentials are committed.** The test-login password is supplied at runtime only (env var / prompt) and never written to any tracked file.

## Layout

```
bench/
  fixtures/          # frozen real ACS payloads (committed test data, secrets masked by API)
  fixture-server/    # deterministic server on :20140 — ETag/304, gzip, WS broadcast, ~0 latency
  tier1-bundle/      # Tier 1 (bundle size) — DONE, see tier1-bundle/RESULTS.md
  PREREGISTRATION.md # RQs + stats plan (committed before data collection)
  README.md          # this file
```

## Tier 2 — Step 2: Fixtures + fixture server  ✅ DONE

### 2a. Capture fixtures (one-time, against a live ACS instance)

Fixtures are byte-frozen real payloads from the four read-only GET endpoints under test.
The ACS dashboard runs on `:20130`; auth is the `auth_token` cookie issued by `POST /api/auth/login`.

```powershell
# password provided at runtime — NOT committed
$pw = Read-Host "ACS password" -AsSecureString
$plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
  [Runtime.InteropServices.Marshal]::SecureStringToBSTR($pw))

curl.exe -s -X POST http://127.0.0.1:20130/api/auth/login `
  -H "Content-Type: application/json" --data-raw "{`"password`":`"$plain`"}" -c cookies.txt

$eps = @{ dashboard="/api/dashboard"; gateways="/api/gateways";
          "daemon-status"="/api/daemon/status"; "stack-status"="/api/stack/status" }
foreach ($k in $eps.Keys) {
  curl.exe -s -o "fixtures/$k.json" -b cookies.txt "http://127.0.0.1:20130$($eps[$k])"
}
Remove-Item cookies.txt   # never keep the session token
```

Captured payload sizes (real ACS data, secrets masked by the API):

| Fixture | Endpoint | Bytes | Size class |
|---------|----------|------:|-----------|
| stack-status.json | /api/stack/status | 490 | small |
| daemon-status.json | /api/daemon/status | 2,624 | small-medium |
| gateways.json | /api/gateways | 8,911 | medium |
| dashboard.json | /api/dashboard | 96,571 | large |

> Fixtures contain real-but-frozen operational values (PIDs, timestamps). That is intentional
> (§4.2): they remove backend variance so the measured time is pure client-data-layer cost.

### 2b. Run the fixture server

```powershell
cd fixture-server
bun run server.ts        # http://127.0.0.1:20140
```

Endpoints:

| Path | Behaviour |
|------|-----------|
| `GET /api/dashboard\|gateways\|daemon/status\|stack/status` | frozen payload, gzip, strong `ETag`, `304` on `If-None-Match` |
| `GET /api/health` | `{ ok, fixtures, rev }` |
| `WS /ws` | clients receive `{type:"update", page, rev, data}` frames |
| `POST /__broadcast?page=<id>` | driver trigger → pushes one update frame to all WS clients |

Smoke test (server must be running): `bun run smoke.ts`.
Verified 2026-06-09: health 200; dashboard 200 gzip + valid JSON; conditional GET → 304; WS broadcast round-trip ≈ 4 ms.

## Tier 2 — Steps 3-6 (next)

3. `shared/` markup + 3 data-layer harnesses (`harness-tide` / `harness-tanstack` / `harness-swr`) + WS adapters
4. Playwright `driver/` + `data-painted` instrumentation + auth `storageState`
5. Pilot run (N=5) + fixture-vs-live cross-check
6. Full collection (N=30, interleaved)
