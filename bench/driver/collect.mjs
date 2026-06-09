// Full collection driver (plan Steps 5-6 + §4,§5,§6).
// Crash-resilient: if --resume flag is passed and results.csv exists, reads
// completed (trial,harness,page) triples and skips them so a restart continues
// exactly where it left off (same seed / run-order determinism).
//
// Prereqs: fixture server :20140 + built harnesses served on :20150.
//
// Usage:
//   node collect.mjs                         # N=30, fresh run
//   node collect.mjs --n=5                   # quick pilot
//   node collect.mjs --throttle=4            # 4x CPU mid-tier profile
//   node collect.mjs --rtt=50 --bw=5         # ~50ms RTT, 5 Mbps (P3 networked)
//   node collect.mjs --seed=12345            # reproduce a run order
//   node collect.mjs --resume                # continue interrupted run (seed from meta)
//   node collect.mjs --append                # append another profile to existing CSV

import { chromium } from "playwright";
import { writeFileSync, appendFileSync, existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const PREVIEW = "http://localhost:20150";
const FIXTURE  = "http://127.0.0.1:20140";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);

// ---- resume: load seed + completed cells from existing CSV ----
const RESUME  = !!args.resume && existsSync("results.csv");
const APPEND  = !!args.append && existsSync("results.csv");
let resumeSeed = null;
const doneCells = new Set(); // "trial|harness|page" already recorded

if (RESUME) {
  // recover seed from saved meta
  try {
    const m = JSON.parse(readFileSync("results-meta.json", "utf8"));
    resumeSeed = m.seed;
  } catch {}
  // rebuild completed-cell index from existing CSV rows (non-warmup, cold scenario = cell done)
  const lines = readFileSync("results.csv", "utf8").trim().split(/\r?\n/);
  const hdr = lines[0].split(",");
  const col = (n) => hdr.indexOf(n);
  for (const l of lines.slice(1)) {
    const r = l.split(",");
    const trial = r[col("trial")], h = r[col("harness")], p = r[col("page")], sc = r[col("scenario")];
    if (trial !== "warmup" && sc === "cold") doneCells.add(`${trial}|${h}|${p}`);
  }
  console.log(`[resume] found ${doneCells.size} completed cells from prior run`);
}

const N          = Number(args.n ?? 30);
const WARMUP     = Number(args.warmup ?? 3);
const THROTTLE   = Number(args.throttle ?? 1);
const RTT        = Number(args.rtt ?? 0);
const BW         = Number(args.bw ?? 0);
const PROFILE    = args.profile ?? (RTT > 0 ? "networked" : THROTTLE > 1 ? "mid-device" : "local-fast");
const SEED       = RESUME && resumeSeed != null ? resumeSeed : Number(args.seed ?? (Date.now() % 2147483647));
const STEADY_MS  = Number(args.idle ?? 2500);

const HARNESSES = ["vanilla", "tide", "tanstack", "swr"];
const PAGES = [
  { route: "dashboard",    marker: ".card" },
  { route: "gateways",     marker: ".row"  },
  { route: "daemon",       marker: ".row"  },
  { route: "stack",        marker: ".row"  },
  { route: "tooling",      marker: ".card" },
  { route: "summary",      marker: ".card" },
  { route: "announcements",marker: ".card" },
];

// seeded RNG (mulberry32)
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
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

// ---- CSV ----
const CSV  = "results.csv";
const COLS = "harness,page,scenario,trial,metric,value,runorder,seed,profile,cpuThrottle,rttMs,ts";
if (!RESUME && !APPEND) writeFileSync(CSV, COLS + "\n");
let runorder = 0;
function row(h, p, scenario, trial, metric, value) {
  if (value == null || Number.isNaN(value)) return;
  appendFileSync(CSV, `${h},${p},${scenario},${trial},${metric},${value},${runorder},${SEED},${PROFILE},${THROTTLE},${RTT},${Date.now()}\n`);
}

// ---- browser instrumentation ----
const initScript = () => {
  window.__fcp = null;
  new PerformanceObserver((list) => {
    for (const e of list.getEntries())
      if (e.name === "first-contentful-paint" && window.__fcp == null) window.__fcp = e.startTime;
  }).observe({ type: "paint", buffered: true });
  window.__longtasks = 0;
  try { new PerformanceObserver((list) => { window.__longtasks += list.getEntries().length; }).observe({ type: "longtask", buffered: true }); } catch {}
};
const RESET = () => {
  window.__bench.painted = []; window.__bench.wsRecv = [];
  performance.clearMarks("data-painted"); performance.clearMarks("ws-recv");
};

async function newPage(browser) {
  const ctx  = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.addInitScript(initScript);
  if (THROTTLE > 1 || RTT > 0 || BW > 0) {
    const cdp = await ctx.newCDPSession(page);
    if (THROTTLE > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: THROTTLE });
    if (RTT > 0 || BW > 0) {
      const bps = BW > 0 ? (BW * 1024 * 1024) / 8 : -1;
      await cdp.send("Network.enable");
      await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: RTT, downloadThroughput: bps, uploadThroughput: bps });
    }
  }
  return { ctx, page };
}

async function waitPainted(page, t = 8000) {
  await page.waitForFunction(() => window.__bench && window.__bench.painted.length > 0, null, { timeout: t });
}

async function measureCell(browser, harness, page, trial) {
  runorder++;
  const url = `${PREVIEW}/${harness}.html#/${page.route}`;
  const { ctx, page: pg } = await newPage(browser);
  try {
    // COLD
    await pg.goto(url, { waitUntil: "load" });
    await pg.evaluate(() => { sessionStorage.clear(); localStorage.clear(); });
    await pg.reload({ waitUntil: "load" });
    await waitPainted(pg);
    const cold = await pg.evaluate(() => ({ ttdp: window.__bench.painted[0], fcp: window.__fcp }));
    row(harness, page.route, "cold",   trial, "ttdp_ms", cold.ttdp);
    row(harness, page.route, "cold",   trial, "fcp_ms",  cold.fcp);

    // REVISIT
    await pg.evaluate(RESET);
    await pg.reload({ waitUntil: "load" });
    await waitPainted(pg);
    const rev = await pg.evaluate(() => ({ ttdp: window.__bench.painted[0] }));
    row(harness, page.route, "revisit", trial, "ttdp_ms", rev.ttdp);

    // UPDATE
    await pg.evaluate(RESET);
    await fetch(`${FIXTURE}/__broadcast?page=${page.route}`, { method: "POST" });
    try {
      await pg.waitForFunction(() => window.__bench.painted.length > 0 && window.__bench.wsRecv.length > 0, null, { timeout: 5000 });
      const upd = await pg.evaluate(() => {
        const recv = window.__bench.wsRecv[0];
        const painted = window.__bench.painted.find((x) => x >= recv);
        return painted != null ? painted - recv : null;
      });
      row(harness, page.route, "update", trial, "update_to_dom_ms", upd);
    } catch { /* update timeout — row omitted */ }

    // STEADY
    await pg.waitForTimeout(STEADY_MS);
    const steady = await pg.evaluate(() => ({
      heap:      performance.memory ? performance.memory.usedJSHeapSize / (1024 * 1024) : null,
      longtasks: window.__longtasks,
    }));
    row(harness, page.route, "steady", trial, "js_heap_mb",   steady.heap);
    row(harness, page.route, "steady", trial, "long_tasks",   steady.longtasks);
  } finally {
    await ctx.close();
  }
}

async function main() {
  const meta = {
    seed: SEED, n: N, warmup: WARMUP, profile: PROFILE,
    cpuThrottle: THROTTLE, rttMs: RTT, bwMbps: BW, steadyIdleMs: STEADY_MS,
    startedAt: new Date().toISOString(),
    harnesses: HARNESSES, pages: PAGES.map((p) => p.route),
    preview: PREVIEW, fixture: FIXTURE,
  };
  try { meta.harnessVersions = JSON.parse(execSync("node -e \"const p=require('../harnesses/package.json');console.log(JSON.stringify(p.dependencies))\"").toString()); } catch {}
  try { meta.tideGitRev = execSync("git rev-parse HEAD", { cwd: "../.." }).toString().trim(); } catch {}

  const browser = await chromium.launch({
    args: ["--enable-precise-memory-info", "--disable-extensions", "--no-first-run"],
  });

  const cells = [];
  for (const h of HARNESSES) for (const p of PAGES) cells.push({ h, p });

  const total = WARMUP + N;
  let skipped = 0;
  for (let trial = 1 - WARMUP; trial <= N; trial++) {
    const label = trial <= 0 ? "warmup" : trial;
    const order = shuffle(cells); // deterministic per seed+trial
    for (const c of order) {
      // resume: skip cells already recorded in the existing CSV
      if (RESUME && label !== "warmup" && doneCells.has(`${label}|${c.h}|${c.p.route}`)) {
        skipped++; runorder++; continue;
      }
      await measureCell(browser, c.h, c.p, label);
    }
    const done = trial + WARMUP;
    process.stdout.write(`\rtrial ${done}/${total}  rows=${existsSync(CSV) ? readFileSync(CSV,"utf8").split("\n").length-2 : 0}  skipped=${skipped}        `);
  }

  await browser.close();
  meta.finishedAt    = new Date().toISOString();
  meta.runorderTotal = runorder;
  writeFileSync(`results-meta-${PROFILE}.json`, JSON.stringify(meta, null, 2));
  writeFileSync("results-meta.json",            JSON.stringify(meta, null, 2));
  console.log(`\nDONE. profile=${PROFILE} seed=${SEED} cpu=${THROTTLE}x rtt=${RTT}ms skipped=${skipped} -> ${CSV}`);
}

main();
