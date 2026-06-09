// Full collection driver (plan Steps 5-6 + §4,§5,§6).
//
// Protocol:
//   - Scenarios per (harness × page): cold, revisit, update, steady (§9.3)
//   - N measured trials per cell + WARMUP discarded (§5.1)
//   - Run order INTERLEAVED across harnesses and randomized per trial with a
//     SEEDED RNG; the seed is recorded (§4.1, §6)
//   - Fresh incognito context per measurement (clean cache); extensions off
//   - Optional CPU throttle via CDP for a "mid-tier device" profile (§6, open Q1)
//   - One row per (cell, scenario, trial, metric) -> results.csv
//   - Environment + versions + seed -> results-meta.json
//
// Prereqs: fixture server :20140 and built harnesses served on :20150.
//   (cd ../fixture-server && bun run server.ts) ; (cd ../harnesses && bun run build && bun run preview)
//
// Usage:
//   node collect.mjs                # N=30, no throttle
//   node collect.mjs --n=5          # quick pilot
//   node collect.mjs --throttle=4   # 4x CPU slowdown profile
//   node collect.mjs --seed=12345   # reproduce a previous run order

import { chromium } from "playwright";
import { writeFileSync, appendFileSync } from "node:fs";
import { execSync } from "node:child_process";

const PREVIEW = "http://localhost:20150";
const FIXTURE = "http://127.0.0.1:20140";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);
const N = Number(args.n ?? 30);
const WARMUP = Number(args.warmup ?? 3);
const THROTTLE = Number(args.throttle ?? 1); // 1 = none
const SEED = Number(args.seed ?? (Date.now() % 2147483647));
const STEADY_IDLE_MS = Number(args.idle ?? 5000);

const HARNESSES = ["tide", "tanstack", "swr"];
const PAGES = [
  { route: "dashboard", marker: ".card" },
  { route: "gateways", marker: ".row" },
  { route: "daemon", marker: ".row" },
  { route: "stack", marker: ".row" },
];

// seeded RNG (mulberry32) for reproducible run-order randomization
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(SEED);
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// instrumentation installed before app code, captures FCP + heap + long tasks
const initScript = () => {
  window.__fcp = null;
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      if (e.name === "first-contentful-paint" && window.__fcp == null) window.__fcp = e.startTime;
    }
  }).observe({ type: "paint", buffered: true });
  window.__longtasks = 0;
  try {
    new PerformanceObserver((list) => {
      window.__longtasks += list.getEntries().length;
    }).observe({ type: "longtask", buffered: true });
  } catch {}
};

const RESET = () => {
  window.__bench.painted = [];
  window.__bench.wsRecv = [];
  performance.clearMarks("data-painted");
  performance.clearMarks("ws-recv");
};

const CSV = "results.csv";
const COLS = "harness,page,scenario,trial,metric,value,runorder,seed,throttle,ts";
writeFileSync(CSV, COLS + "\n");
let runorder = 0;
function row(h, p, scenario, trial, metric, value) {
  if (value == null || Number.isNaN(value)) return;
  appendFileSync(CSV, `${h},${p},${scenario},${trial},${metric},${value},${runorder},${SEED},${THROTTLE},${Date.now()}\n`);
}

async function newPage(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.addInitScript(initScript);
  if (THROTTLE > 1) {
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: THROTTLE });
  }
  return { ctx, page };
}

async function waitPainted(page, t = 8000) {
  await page.waitForFunction(() => window.__bench && window.__bench.painted.length > 0, null, { timeout: t });
}

// One full visit to a cell: measures cold, revisit, update, steady for this trial.
async function measureCell(browser, harness, page, trial) {
  runorder++;
  const url = `${PREVIEW}/${harness}.html#/${page.route}`;
  const { ctx, page: pg } = await newPage(browser);
  try {
    // COLD — clean storage, hard reload, first data paint
    await pg.goto(url, { waitUntil: "load" });
    await pg.evaluate(() => {
      sessionStorage.clear();
      localStorage.clear();
    });
    await pg.reload({ waitUntil: "load" });
    await waitPainted(pg);
    const cold = await pg.evaluate(() => ({ ttdp: window.__bench.painted[0], fcp: window.__fcp }));
    row(harness, page.route, "cold", trial, "ttdp_ms", cold.ttdp);
    row(harness, page.route, "cold", trial, "fcp_ms", cold.fcp);

    // REVISIT — cache now warm; reload and measure first data paint
    await pg.evaluate(RESET);
    await pg.reload({ waitUntil: "load" });
    await waitPainted(pg);
    const revisit = await pg.evaluate(() => ({ ttdp: window.__bench.painted[0], fcp: window.__fcp }));
    row(harness, page.route, "revisit", trial, "ttdp_ms", revisit.ttdp);

    // UPDATE — push one frozen update, measure receive->DOM commit
    await pg.evaluate(RESET);
    await fetch(`${FIXTURE}/__broadcast?page=${page.route}`, { method: "POST" });
    try {
      await pg.waitForFunction(
        () => window.__bench.painted.length > 0 && window.__bench.wsRecv.length > 0,
        null,
        { timeout: 5000 },
      );
      const upd = await pg.evaluate(() => {
        const recv = window.__bench.wsRecv[0];
        const painted = window.__bench.painted.find((x) => x >= recv);
        return painted != null ? painted - recv : null;
      });
      row(harness, page.route, "update", trial, "update_to_dom_ms", upd);
    } catch {
      /* update did not propagate within timeout; row omitted */
    }

    // STEADY (exploratory) — idle, then sample heap + long-task count
    await pg.waitForTimeout(STEADY_IDLE_MS);
    const steady = await pg.evaluate(() => ({
      heap: performance.memory ? performance.memory.usedJSHeapSize / (1024 * 1024) : null,
      longtasks: window.__longtasks,
    }));
    row(harness, page.route, "steady", trial, "js_heap_mb", steady.heap);
    row(harness, page.route, "steady", trial, "long_tasks", steady.longtasks);
  } finally {
    await ctx.close();
  }
}

async function main() {
  const meta = {
    seed: SEED,
    n: N,
    warmup: WARMUP,
    cpuThrottle: THROTTLE,
    steadyIdleMs: STEADY_IDLE_MS,
    startedAt: new Date().toISOString(),
    harnesses: HARNESSES,
    pages: PAGES.map((p) => p.route),
    preview: PREVIEW,
    fixture: FIXTURE,
  };
  try {
    meta.harnessVersions = JSON.parse(
      execSync("node -e \"const p=require('../harnesses/package.json');console.log(JSON.stringify(p.dependencies))\"").toString(),
    );
  } catch {}
  try {
    meta.tideGitRev = execSync("git rev-parse HEAD", { cwd: "../.." }).toString().trim();
  } catch {}

  const browser = await chromium.launch({
    args: ["--enable-precise-memory-info", "--disable-extensions", "--no-first-run"],
  });

  const cells = [];
  for (const h of HARNESSES) for (const p of PAGES) cells.push({ h, p });

  const total = WARMUP + N;
  for (let trial = 1 - WARMUP; trial <= N; trial++) {
    const order = shuffle(cells); // interleaved + randomized per trial
    for (const c of order) {
      const label = trial <= 0 ? "warmup" : trial;
      await measureCell(browser, c.h, c.p, label);
    }
    const done = trial + WARMUP;
    if (done % 1 === 0) process.stdout.write(`\rtrial ${done}/${total}  (rows so far via ${CSV})        `);
  }

  await browser.close();
  meta.finishedAt = new Date().toISOString();
  meta.runorderTotal = runorder;
  writeFileSync("results-meta.json", JSON.stringify(meta, null, 2));
  console.log(`\nDONE. seed=${SEED} throttle=${THROTTLE}x  -> ${CSV} + results-meta.json`);
}

main();
