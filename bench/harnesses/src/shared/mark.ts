// Instrumentation — IDENTICAL for all three harnesses (construct validity, plan §3).
//
// data-painted : marked inside the first/each effect after data is truthy, AFTER
//                requestAnimationFrame (i.e. the frame the real data is committed
//                to the DOM). This single semantic point dominates fairness.
// ws-recv      : marked by the shared timing-probe socket the instant a WS frame
//                arrives. Used as t0 for Update->DOM. Identical across libs.
//
// The driver reads these via performance.getEntriesByName(...). For full-page
// loads, mark.startTime is relative to navigationStart (timeOrigin) => TTDP.

declare global {
  interface Window {
    __bench: {
      painted: number[]; // performance.now() of each data commit
      wsRecv: number[]; // performance.now() of each WS frame arrival
      harness: string;
    };
  }
}

function store(): Window["__bench"] {
  if (!window.__bench) {
    window.__bench = { painted: [], wsRecv: [], harness: "?" };
  }
  return window.__bench;
}

export function setHarness(name: string) {
  store().harness = name;
}

/** Call after data becomes truthy, inside rAF, to record the painted frame. */
export function markDataPainted() {
  requestAnimationFrame(() => {
    const t = performance.now();
    store().painted.push(t);
    performance.mark("data-painted", { detail: { t } } as PerformanceMarkOptions);
  });
}

/** Call the instant a raw WS frame arrives (timing probe). */
export function markWsRecv() {
  const t = performance.now();
  store().wsRecv.push(t);
  performance.mark("ws-recv", { detail: { t } } as PerformanceMarkOptions);
}

/** Reset per-trial counters (driver calls window.__bench reset via evaluate too). */
export function resetMarks() {
  const s = store();
  s.painted = [];
  s.wsRecv = [];
  performance.clearMarks("data-painted");
  performance.clearMarks("ws-recv");
}
