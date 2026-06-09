import { render } from "solid-js/web";
import { createTide, TideProvider } from "@uikode/tide";
import { AppShell, type DataLayer } from "./shared/AppShell";
import { BASE, WS_URL, STALE_TIME, GC_TIME } from "./shared/config";
import { markWsRecv } from "./shared/mark";

// ── Tide data layer ──────────────────────────────────────────────────────────
// Native WebSocket-first SWR. Sync sessionStorage hydration is built in (persist),
// and the `ws` extractor consumes the shared TideProvider socket directly (native
// real-time path — measured directly per plan §9.4). ws-recv is marked here, the
// first point Tide's own pipeline sees the update (causally before DOM commit).
const tideLayer: DataLayer = {
  name: "tide",
  useData(page) {
    const r = createTide<unknown>({
      key: page.key,
      fetcher: () => fetch(BASE + page.endpoint).then((res) => res.json()),
      ws: (msg: any) => {
        if (msg?.type === "update" && msg.page === page.wsPage) {
          markWsRecv();
          return msg.data;
        }
        return null;
      },
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
