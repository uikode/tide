// ── Manual WebSocket adapter for solid-swr ────────────────────────────────────
// Shown VERBATIM in the white paper appendix (plan §9.4). solid-swr has no native
// WS push, so we write the pushed payload straight into its Store (no refetch),
// the apples-to-apples equivalent of Tide's signal push.
//
// Integration cost (counted for the paper): this file + the SwrProvider/store
// wiring in entry-swr.tsx. solid-swr also has no built-in persistence, so there is
// no sync-revisit hydration here — reported as a capability trade-off, not hidden.
import { Store } from "solid-swr";
import { BASE, PAGES, WS_URL } from "../shared/config";

export function startSwrWsAdapter(store: Store): WebSocket {
  const urlByPage = new Map(PAGES.map((p) => [p.wsPage, BASE + p.endpoint]));
  const ws = new WebSocket(WS_URL);
  ws.onmessage = (e) => {
    let msg: any;
    try {
      msg = JSON.parse(e.data);
    } catch {
      return;
    }
    if (msg?.type === "update" && msg.page) {
      const key = urlByPage.get(msg.page);
      if (key) store.update(key, { data: msg.data, isLoading: false, err: undefined });
    }
  };
  return ws;
}
