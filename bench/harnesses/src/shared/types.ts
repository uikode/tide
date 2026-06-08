// Minimal types for the four frozen ACS payloads. Loose where the real payload
// is large/variable — the harness renders representative fields only.

export interface DashboardPayload {
  success: boolean;
  data: {
    alerts: unknown[];
    hermes: Record<string, unknown>;
    nineRouter: Record<string, unknown>;
    scheduler: Record<string, unknown>;
    stack: Record<string, unknown>;
    stats: Record<string, number | string>;
    tasks: Array<Record<string, unknown>>;
  };
}

export interface GatewayItem {
  name: string;
  role: string;
  status: string;
  platform: string;
  active_agents: number;
  pid: number;
  auto_start: boolean;
  last_seen: string;
}
export interface GatewaysPayload {
  items: GatewayItem[];
}

export interface DaemonTask {
  name: string;
  status: string;
  duration_ms: number;
  runs: number;
  errors: number;
  consec_fail: number;
}
export interface DaemonPayload {
  success: boolean;
  data: {
    running: boolean;
    pid: number;
    started_at: string;
    uptime_seconds: number;
    tasks: DaemonTask[];
  };
}

export interface StackComponent {
  name: string;
  running: boolean;
  pid?: number;
  port?: number;
  auto_start: boolean;
  running_count?: number;
  total?: number;
}
export interface StackPayload {
  success: boolean;
  data: {
    components: StackComponent[];
    nine_router_online: boolean;
    os_service: Record<string, unknown>;
  };
}
