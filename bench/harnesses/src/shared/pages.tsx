import { Show, For, type Accessor } from "solid-js";
import { SkeletonCards, SkeletonRows } from "./skeletons";
import type { DashboardPayload, GatewaysPayload, DaemonPayload, StackPayload } from "./types";

type ViewProps<T> = { data: Accessor<T | null | undefined> };

export function DashboardView(props: ViewProps<DashboardPayload>) {
  return (
    <Show when={props.data()} fallback={<SkeletonCards n={8} />}>
      {(d) => {
        const stats = () => d().data.stats ?? {};
        return (
          <div class="grid">
            <For each={Object.entries(stats())}>
              {([k, v]) => (
                <div class="card">
                  <div class="k">{k}</div>
                  <div class="v">{String(v)}</div>
                </div>
              )}
            </For>
            <div class="card">
              <div class="k">tasks</div>
              <div class="v">{d().data.tasks?.length ?? 0}</div>
            </div>
            <div class="card">
              <div class="k">alerts</div>
              <div class="v">{d().data.alerts?.length ?? 0}</div>
            </div>
          </div>
        );
      }}
    </Show>
  );
}

export function GatewaysView(props: ViewProps<GatewaysPayload>) {
  return (
    <Show when={props.data()} fallback={<SkeletonRows n={11} />}>
      {(d) => (
        <div class="table">
          <For each={d().items}>
            {(g) => (
              <div class="row">
                <span class="name">{g.name}</span>
                <span class="muted">{g.role}</span>
                <span class="muted">{g.active_agents} agents</span>
                <span class={`badge ${g.status === "running" ? "ok" : "bad"}`}>{g.status}</span>
              </div>
            )}
          </For>
        </div>
      )}
    </Show>
  );
}

export function DaemonView(props: ViewProps<DaemonPayload>) {
  return (
    <Show when={props.data()} fallback={<SkeletonRows n={11} />}>
      {(d) => (
        <>
          <div class="grid" style="margin-bottom:14px">
            <div class="card"><div class="k">running</div><div class="v">{String(d().data.running)}</div></div>
            <div class="card"><div class="k">pid</div><div class="v">{d().data.pid}</div></div>
            <div class="card"><div class="k">uptime (s)</div><div class="v">{d().data.uptime_seconds}</div></div>
            <div class="card"><div class="k">tasks</div><div class="v">{d().data.tasks?.length ?? 0}</div></div>
          </div>
          <div class="table">
            <For each={d().data.tasks}>
              {(t) => (
                <div class="row">
                  <span class="name">{t.name}</span>
                  <span class="muted">{t.duration_ms}ms</span>
                  <span class="muted">runs {t.runs}</span>
                  <span class={`badge ${t.errors === 0 ? "ok" : "bad"}`}>{t.status}</span>
                </div>
              )}
            </For>
          </div>
        </>
      )}
    </Show>
  );
}

export function StackView(props: ViewProps<StackPayload>) {
  return (
    <Show when={props.data()} fallback={<SkeletonRows n={4} />}>
      {(d) => (
        <div class="table">
          <For each={d().data.components}>
            {(c) => (
              <div class="row">
                <span class="name">{c.name}</span>
                <span class="muted">{c.port ? `:${c.port}` : c.pid ? `pid ${c.pid}` : ""}</span>
                <span class="muted">{c.running_count != null ? `${c.running_count}/${c.total}` : ""}</span>
                <span class={`badge ${c.running ? "ok" : "bad"}`}>{c.running ? "running" : "stopped"}</span>
              </div>
            )}
          </For>
        </div>
      )}
    </Show>
  );
}

export const VIEWS = {
  dashboard: DashboardView,
  gateways: GatewaysView,
  daemon: DaemonView,
  stack: StackView,
} as const;

