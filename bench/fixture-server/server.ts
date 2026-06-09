/**
 * Deterministic frozen-payload fixture server for the Tide benchmark (Tier 2).
 *
 * Purpose (see plan §4.2): contribute ZERO backend variance so measured time is
 * pure client-data-layer cost. Serves byte-identical real ACS payloads from
 * memory with ETag/304 + gzip, and a controllable WebSocket broadcast used to
 * measure Update->DOM latency.
 *
 * Runs on :20140 — NEVER :20130 (the live dashboard). Read-only, GET-only.
 *
 * Run:  bun run server.ts   (or: bun run start)
 */

import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = join(__dirname, "..", "fixtures");
const PORT = Number(process.env.BENCH_PORT ?? 20140);

// route path -> { fixture filename, short page id }
const ROUTES: Record<string, { file: string; id: string }> = {
  "/api/dashboard": { file: "dashboard.json", id: "dashboard" },
  "/api/gateways": { file: "gateways.json", id: "gateways" },
  "/api/daemon/status": { file: "daemon-status.json", id: "daemon" },
  "/api/stack/status": { file: "stack-status.json", id: "stack" },
  "/api/agentic/tooling-status": { file: "agentic-tooling-status.json", id: "tooling" },
  "/api/agentic/summary": { file: "agentic-summary.json", id: "summary" },
  "/api/announcements": { file: "announcements.json", id: "announcements" },
};
const routeById = (id: string) => Object.keys(ROUTES).find((r) => ROUTES[r].id === id) ?? "/api/dashboard";

interface Frozen {
  page: string; // short id (dashboard, gateways, daemon, stack, tooling, summary, announcements)
  raw: Buffer; // byte-identical payload
  gz: Buffer; // pre-gzipped (level 9)
  etag: string; // strong validator over raw bytes
}

// Load + freeze every fixture once at startup (in-memory => ~0 latency).
const frozen: Record<string, Frozen> = {};
for (const [route, { file, id }] of Object.entries(ROUTES)) {
  const raw = readFileSync(join(FIXTURES_DIR, file));
  const etag = '"' + createHash("sha1").update(raw).digest("hex") + '"';
  frozen[route] = { page: id, raw, gz: gzipSync(raw, { level: 9 }), etag };
}

const COMMON_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "if-none-match,content-type",
  "cache-control": "no-cache", // force revalidation -> exercises ETag/304 path
};

// WS clients + monotonic revision (deterministic-enough: latency is independent
// of the rev value; rev only guarantees a *distinct* change so a DOM commit fires).
const sockets = new Set<any>();
let rev = 0;

const server = Bun.serve({
  port: PORT,
  hostname: "127.0.0.1",
  development: false,

  fetch(req, srv) {
    const url = new URL(req.url);
    const path = url.pathname;

    // WebSocket upgrade for real-time update measurement.
    if (path === "/ws") {
      if (srv.upgrade(req)) return undefined as unknown as Response;
      return new Response("ws upgrade failed", { status: 400 });
    }

    // Control plane (driver-only): trigger a deterministic update broadcast.
    // POST /__broadcast?page=dashboard  -> pushes one frozen update frame.
    if (path === "/__broadcast" && req.method === "POST") {
      const page = url.searchParams.get("page") ?? "dashboard";
      rev += 1;
      const route = routeById(page);
      const data = JSON.parse(frozen[route].raw.toString("utf8"));
      data._bench = rev; // deterministic real change so every lib commits an update
      const frame = JSON.stringify({ type: "update", page, rev, data });
      let n = 0;
      for (const ws of sockets) {
        ws.send(frame);
        n++;
      }
      return Response.json({ ok: true, rev, delivered: n });
    }

    if (path === "/api/health") {
      return Response.json({ ok: true, fixtures: Object.keys(ROUTES).length, rev });
    }

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: COMMON_HEADERS });
    }

    const f = frozen[path];
    if (!f) return new Response("not found", { status: 404, headers: COMMON_HEADERS });

    // Conditional request -> 304 (mirrors ACS revalidation semantics).
    if (req.headers.get("if-none-match") === f.etag) {
      return new Response(null, {
        status: 304,
        headers: { ...COMMON_HEADERS, etag: f.etag },
      });
    }

    const accepts = (req.headers.get("accept-encoding") ?? "").includes("gzip");
    const headers: Record<string, string> = {
      ...COMMON_HEADERS,
      "content-type": "application/json; charset=utf-8",
      etag: f.etag,
    };
    if (accepts) {
      headers["content-encoding"] = "gzip";
      headers["content-length"] = String(f.gz.byteLength);
      return new Response(f.gz, { headers });
    }
    headers["content-length"] = String(f.raw.byteLength);
    return new Response(f.raw, { headers });
  },

  websocket: {
    open(ws) {
      sockets.add(ws);
    },
    close(ws) {
      sockets.delete(ws);
    },
    message(ws, msg) {
      // Allow a client/driver to self-trigger an update over the socket too.
      if (typeof msg === "string" && msg.startsWith("broadcast:")) {
        const page = msg.slice("broadcast:".length) || "dashboard";
        rev += 1;
        const route = routeById(page);
        const data = JSON.parse(frozen[route].raw.toString("utf8"));
        data._bench = rev;
        const frame = JSON.stringify({ type: "update", page, rev, data });
        for (const s of sockets) s.send(frame);
      }
    },
  },
});

console.log(`[fixture-server] frozen ACS payloads on http://127.0.0.1:${server.port}`);
for (const [route, { file }] of Object.entries(ROUTES)) {
  console.log(`  ${route}  <-  ${file}  (${frozen[route].raw.byteLength} B, etag ${frozen[route].etag})`);
}
console.log(`  /ws            WebSocket (Update->DOM)`);
console.log(`  POST /__broadcast?page=<id>   trigger update frame`);
