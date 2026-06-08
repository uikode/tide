// Shared WS timing probe — IDENTICAL in all three harnesses (symmetric instrumentation).
//
// Purpose: provide a single, library-independent t0 for the Update->DOM metric.
// It opens its own socket to the fixture server and marks `ws-recv` the instant a
// frame arrives. The library's OWN mechanism (Tide's internal socket / the TanStack
// or swr manual adapter socket) drives the actual DOM update in parallel.
//
// Net effect: every harness has exactly 2 sockets (probe + lib), so the probe adds
// the same fixed cost everywhere and cancels out in cross-library comparison.

import { onCleanup } from "solid-js";
import { WS_URL } from "./config";
import { markWsRecv } from "./mark";

export function startTimingProbe() {
  let ws: WebSocket | null = null;
  try {
    ws = new WebSocket(WS_URL);
    ws.onmessage = () => markWsRecv();
  } catch {
    /* probe is best-effort; absence only affects update metric, flagged by driver */
  }
  onCleanup(() => ws?.close());
}
