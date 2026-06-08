import { render } from "solid-js/web";
import {
  QueryClient,
  QueryClientProvider,
  createQuery,
} from "@tanstack/solid-query";
import { persistQueryClient } from "@tanstack/solid-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { AppShell, type DataLayer } from "./shared/AppShell";
import { BASE, STALE_TIME, GC_TIME } from "./shared/config";
import { startTanstackWsAdapter } from "./adapters/ws-tanstack";

// ── TanStack Solid Query data layer ───────────────────────────────────────────
// Configured per official SolidQuery best-practice (plan §9.2) + sessionStorage
// persistence for FAIR instant-revisit parity with Tide's built-in cache.
const qc = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
      refetchOnWindowFocus: true,
      retry: 3,
    },
  },
});

// Persist cache to sessionStorage (fair vs Tide's sync hydration).
persistQueryClient({
  queryClient: qc,
  persister: createSyncStoragePersister({ storage: window.sessionStorage }),
});

// Real-time parity via documented manual WS adapter.
startTanstackWsAdapter(qc);

const tanstackLayer: DataLayer = {
  name: "tanstack",
  useData(page) {
    const q = createQuery(() => ({
      queryKey: [page.key],
      queryFn: () => fetch(BASE + page.endpoint).then((res) => res.json()),
    }));
    return { data: () => q.data };
  },
};

render(
  () => (
    <QueryClientProvider client={qc}>
      <AppShell layer={tanstackLayer} />
    </QueryClientProvider>
  ),
  document.getElementById("root")!,
);
