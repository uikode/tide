import { render } from "solid-js/web";
import { createSignal, onMount, onCleanup } from "solid-js";
import { AppShell, type DataLayer } from "./shared/AppShell";
import { BASE, WS_URL } from "./shared/config";
import { markWsRecv } from "./shared/mark";

// ── Vanilla CONTROL (no library) ──────────────────────────────────────────────
// Raw fetch + createSignal + a hand-rolled WS->signal adapter. NO caching layer,
// NO persistence. This is the scientific floor (RQ6): it establishes what plain
// SolidJS does, so we can separate renderer-bound results (shared by all) from
// genuine library wins. Revisit RE-FETCHES (no warm cache) — the honest "without
// a data library" number.

// One app-wide socket (parity: every arm has exactly one lib/control socket),
// dispatching frames to the mounted page's setter.
const setters = new Map<string, (d: unknown) => void>();
const ws = new WebSocket(WS_URL);
ws.onmessage = (e) => {
  let msg: any;
  try {
    msg = JSON.parse(e.data);
  } catch {
    return;
  }
  if (msg?.type === "update" && msg.page) {
    const set = setters.get(msg.page);
    if (set) {
      markWsRecv();
      set(msg.data);
    }
  }
};

const vanillaLayer: DataLayer = {
  name: "vanilla",
  useData(page) {
    const [data, setData] = createSignal<unknown>(null);
    setters.set(page.wsPage, (d) => setData(() => d));
    onCleanup(() => setters.delete(page.wsPage));
    onMount(() => {
      // no cache: always re-fetch on mount (cold AND revisit)
      fetch(BASE + page.endpoint)
        .then((r) => r.json())
        .then((d) => setData(() => d))
        .catch(() => {});
    });
    return { data };
  },
};

render(() => <AppShell layer={vanillaLayer} />, document.getElementById("root")!);
