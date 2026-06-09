import { render } from "solid-js/web";
import { onCleanup } from "solid-js";
import { SwrProvider, useSwr, Store } from "solid-swr";
import { AppShell, type DataLayer } from "./shared/AppShell";
import { BASE } from "./shared/config";
import { startSwrWsAdapter, registerSwrMutate } from "./adapters/ws-swr";

// ── solid-swr data layer ──────────────────────────────────────────────────────
// Per solid-swr docs: configure a shared Store + fetcher via SwrProvider; the key
// is the resource URL. No persistence (library has none) — revisit re-fetches.
const store = new Store();
const fetcher = (key: string, { signal }: { signal: AbortSignal }) =>
  fetch(key, { signal }).then((res) => res.json());

// Real-time parity via documented manual WS adapter.
startSwrWsAdapter();

const swrLayer: DataLayer = {
  name: "swr",
  useData(page) {
    const url = BASE + page.endpoint;
    const r = useSwr<unknown, unknown>(() => url);
    // expose this instance's reactive mutate to the WS adapter while mounted
    onCleanup(registerSwrMutate(url, (d) => r.mutate(d as any)));
    return { data: () => r.v().data };
  },
};

render(
  () => (
    <SwrProvider value={{ store, fetcher }}>
      <AppShell layer={swrLayer} />
    </SwrProvider>
  ),
  document.getElementById("root")!,
);
