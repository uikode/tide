import { render } from "solid-js/web";
import { createTide, TideProvider } from "@uikode/tide";
import { AppShell, type DataLayer } from "./shared/AppShell";
import { BASE, WS_URL, STALE_TIME, GC_TIME } from "./shared/config";

// ── Tide data layer ──────────────────────────────────────────────────────────
// Native WebSocket-first SWR. Sync sessionStorage hydration is built in (persist),
// and the `ws` extractor consumes the shared TideProvider socket directly (native
// real-time path — measured directly per plan §9.4).
const tideLayer: DataLayer = {
  name: "tide",
  useData(page) {
    const r = createTide<unknown>({
      key: page.key,
      fetcher: () => fetch(BASE + page.endpoint).then((res) => res.json()),
      ws: (msg: any) => (msg?.type === "update" && msg.page === page.wsPage ? msg.data : null),
      staleTime: STALE_TIME,
      cacheTime: GC_TIME,
      // persist: true (default) — instant revisit from sessionStorage
    });
    return { data: r.data };
  },
};

render(
  () => (
    <TideProvider ws={{ url: WS_URL }}>
      <AppShell layer={tideLayer} />
    </TideProvider>
  ),
  document.getElementById("root")!,
);
