// ── Manual WebSocket adapter for solid-swr ────────────────────────────────────
// Shown VERBATIM in the white paper appendix (plan §9.4). solid-swr has no native
// WS push, so we push the payload into the cache via the hook's own reactive
// `mutate` (the documented, guaranteed-reactive API), the apples-to-apples
// equivalent of Tide's signal push. ws-recv is marked the instant this adapter
// sees the update (before mutate), causally before the DOM commit.
//
// Integration cost (counted for the paper): this file + the per-resource
// registerSwrMutate wiring in entry-swr.tsx. solid-swr also has no built-in
// persistence, so there is no sync-revisit hydration — reported as a capability
// trade-off, not hidden.
import { BASE, PAGES, WS_URL } from "../shared/config";
import { markWsRecv } from "../shared/mark";

type MutateFn = (data: unknown) => void;
const registry = new Map<string, MutateFn>();

/** A mounted useSwr instance registers its reactive mutate, keyed by resource URL. */
export function registerSwrMutate(key: string, fn: MutateFn): () => void {
  registry.set(key, fn);
  return () => registry.delete(key);
}

export function startSwrWsAdapter(): WebSocket {
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
      const fn = key ? registry.get(key) : undefined;
      if (fn) {
        markWsRecv();
        fn(msg.data);
      }
    }
  };
  return ws;
}
