// Shared, identical across all three harnesses. ONLY the data layer differs.
// Fetchers hit the deterministic fixture server on :20140 directly (CORS-open).

export const BASE = "http://127.0.0.1:20140";
export const WS_URL = "ws://127.0.0.1:20140/ws";

export interface PageDef {
  /** route path */
  path: string;
  /** cache key (shared key per page so all libs use the same identity) */
  key: string;
  /** REST endpoint on the fixture server */
  endpoint: string;
  /** page id used by the WS broadcast frame ({type,page,rev,data}) */
  wsPage: string;
  /** human label */
  label: string;
}

export const PAGES: PageDef[] = [
  { path: "/dashboard", key: "dashboard", endpoint: "/api/dashboard", wsPage: "dashboard", label: "Dashboard" },
  { path: "/gateways", key: "gateways", endpoint: "/api/gateways", wsPage: "gateways", label: "Gateways" },
  { path: "/daemon", key: "daemon", endpoint: "/api/daemon/status", wsPage: "daemon", label: "Daemon" },
  { path: "/stack", key: "stack", endpoint: "/api/stack/status", wsPage: "stack", label: "Stack" },
];

/** Freshness window shared by all libs (matches WS broadcast cadence, plan §9.2). */
export const STALE_TIME = 5_000;
export const GC_TIME = 5 * 60_000;
