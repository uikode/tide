// Smoke test for the fixture server. Run while server.ts is up: bun run smoke.ts
const BASE = "http://127.0.0.1:20140";
const out: string[] = [];
const log = (s: string) => out.push(s);

// 1. health
const h = await fetch(`${BASE}/api/health`);
log(`health: ${h.status} ${await h.text()}`);

// 2. GET dashboard with gzip
const r1 = await fetch(`${BASE}/api/dashboard`, { headers: { "accept-encoding": "gzip" } });
const enc = r1.headers.get("content-encoding");
const etag = r1.headers.get("etag");
const body = await r1.text(); // fetch auto-decompresses
log(`dashboard: status=${r1.status} enc=${enc} etag=${etag} decoded-bytes=${body.length} valid-json=${(() => { try { JSON.parse(body); return true; } catch { return false; } })()}`);

// 3. conditional revalidation -> 304
const r2 = await fetch(`${BASE}/api/dashboard`, { headers: { "if-none-match": etag ?? "" } });
log(`revalidate: status=${r2.status} (expect 304)`);

// 4. WS broadcast round-trip latency
await new Promise<void>((resolve) => {
  const ws = new WebSocket(`ws://127.0.0.1:20140/ws`);
  ws.onopen = () => {
    const t0 = performance.now();
    ws.onmessage = (ev) => {
      const dt = performance.now() - t0;
      const frame = JSON.parse(ev.data as string);
      log(`ws update: type=${frame.type} page=${frame.page} rev=${frame.rev} dataKeys=${Object.keys(frame.data).join(",")} rtt=${dt.toFixed(2)}ms`);
      ws.close();
      resolve();
    };
    // trigger via control endpoint
    fetch(`${BASE}/__broadcast?page=daemon`, { method: "POST" });
  };
  setTimeout(() => { log("ws: TIMEOUT"); resolve(); }, 3000);
});

const fs = require("fs");
fs.writeFileSync("smoke.result.txt", out.join("\n"));
console.log(out.join("\n"));
