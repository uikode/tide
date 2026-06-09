// ── Manual WebSocket adapter for TanStack Query ───────────────────────────────
// Shown VERBATIM in the white paper appendix (plan §9.4). TanStack has no native
// WS push, so real-time parity with Tide requires this glue. We write the pushed
// payload straight into the cache via setQueryData (the recommended low-latency
// push pattern — no refetch round-trip), making it the fairest apples-to-apples
// comparison against Tide's signal push.
//
// Integration cost (counted for the paper): this file + 1 extra dep
// (none beyond @tanstack/solid-query) + the persist wiring in entry-tanstack.tsx.
import type { QueryClient } from "@tanstack/solid-query";
import { WS_URL } from "../shared/config";
import { markWsRecv } from "../shared/mark";

export function startTanstackWsAdapter(qc: QueryClient): WebSocket {
  const ws = new WebSocket(WS_URL);
  ws.onmessage = (e) => {
    let msg: any;
    try {
      msg = JSON.parse(e.data);
    } catch {
      return;
    }
    if (msg?.type === "update" && msg.page) {
      markWsRecv(); // first point this adapter sees the update (before cache write)
      qc.setQueryData([msg.page], msg.data);
    }
  };
  return ws;
}
