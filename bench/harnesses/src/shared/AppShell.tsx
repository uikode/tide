import { For, type Accessor, type ParentProps } from "solid-js";
import { HashRouter, Route, A } from "@solidjs/router";
import { PAGES, type PageDef } from "./config";
import { VIEWS } from "./pages";
import { startTimingProbe } from "./probe";
import { setHarness } from "./mark";
import "./styles.css";

// A data layer is the ONLY thing that differs between harnesses.
export interface DataLayer {
  name: string;
  /** Return reactive data for a page. Called inside a route component context. */
  useData(page: PageDef): { data: Accessor<unknown> };
}

function NavShell(props: ParentProps) {
  // Shared WS timing probe — identical & symmetric across harnesses.
  startTimingProbe();
  return (
    <div class="app">
      <nav class="nav">
        <h1>bench</h1>
        <For each={PAGES}>
          {(p) => (
            <A href={p.path} activeClass="active" end>
              {p.label}
            </A>
          )}
        </For>
      </nav>
      <main class="main">{props.children}</main>
    </div>
  );
}

function PageRoute(props: { page: PageDef; layer: DataLayer }) {
  const { data } = props.layer.useData(props.page);
  const View = VIEWS[props.page.wsPage as keyof typeof VIEWS] as (p: {
    data: Accessor<unknown>;
  }) => unknown;
  return (
    <>
      <h2 class="page-title" data-page={props.page.wsPage}>
        {props.page.label}
      </h2>
      {View({ data })}
    </>
  );
}

export function AppShell(props: { layer: DataLayer }) {
  setHarness(props.layer.name);
  return (
    <HashRouter root={NavShell}>
      <For each={PAGES}>
        {(page) => <Route path={page.path} component={() => <PageRoute page={page} layer={props.layer} />} />}
      </For>
      <Route path="*" component={() => <p class="muted">pick a page</p>} />
    </HashRouter>
  );
}
