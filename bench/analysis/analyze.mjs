// Analysis (plan Step 7 + §5 + §18). Distribution-aware, nonparametric, with
// effect sizes and multiple-comparison correction. Profile-aware (P1/P2/P3).
// Self-contained (no Python/scipy); methods implemented explicitly and documented.
//
//   - per (profile,arm,page,scenario,metric): n, median, p95, p99, IQR, min, max, mean
//   - pairwise tide vs {vanilla,tanstack,swr}: Mann-Whitney U + normal approx p
//     (tie-corrected) + Cliff's delta + median diff
//   - Holm-Bonferroni correction per profile family (alpha=0.05)
//   - SVG box plots per (profile,page,scenario,metric), colorblind-safe, n shown
//   - benchmark.json (schema tide-bench/v1) with raw samples for served charts (§18)
//
// Warmup rows (trial == "warmup") are DISCARDED. Usage: node analyze.mjs [csv]
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CSV = process.argv[2] ?? join(__dirname, "..", "driver", "results.csv");
const FIG = join(__dirname, "figures");
mkdirSync(FIG, { recursive: true });

const ALPHA = 0.05;
const ARMS = ["vanilla", "tide", "tanstack", "swr"];
const COMPETITORS = ["vanilla", "tanstack", "swr"]; // tide compared against these
const COLORS = { tide: "#0072B2", tanstack: "#E69F00", swr: "#009E73", vanilla: "#999999" };

// ---- load ----
const lines = readFileSync(CSV, "utf8").trim().split(/\r?\n/);
const header = lines[0].split(",");
const idx = Object.fromEntries(header.map((h, i) => [h, i]));
const rows = lines.slice(1).map((l) => l.split(","));
const measured = rows.filter((r) => r[idx.trial] !== "warmup");

const prof = (r) => (idx.profile != null ? r[idx.profile] : "local-fast");
const groups = new Map(); // key = profile|arm|page|scenario|metric -> number[]
for (const r of measured) {
  const key = `${prof(r)}|${r[idx.harness]}|${r[idx.page]}|${r[idx.scenario]}|${r[idx.metric]}`;
  const v = Number(r[idx.value]);
  if (Number.isNaN(v)) continue;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(v);
}

// ---- stats helpers ----
const sortNum = (a) => a.slice().sort((x, y) => x - y);
function percentile(sorted, p) {
  if (!sorted.length) return null;
  const i = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(i), hi = Math.ceil(i);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
}
function describe(arr) {
  const s = sortNum(arr);
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  return { n: arr.length, median: percentile(s, 50), p95: percentile(s, 95), p99: percentile(s, 99),
    iqr: percentile(s, 75) - percentile(s, 25), min: s[0], max: s[s.length - 1], mean };
}
function normCdf(z) {
  const t = 1 / (1 + 0.2316419 * z);
  const d = 0.3989422804014327 * Math.exp(-(z * z) / 2);
  const p = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return 1 - p;
}
function mannWhitney(x, y) {
  const n1 = x.length, n2 = y.length;
  const all = x.map((v) => ["x", v]).concat(y.map((v) => ["y", v]));
  all.sort((a, b) => a[1] - b[1]);
  const ranks = new Array(all.length);
  let i = 0; const tie = [];
  while (i < all.length) {
    let j = i;
    while (j + 1 < all.length && all[j + 1][1] === all[i][1]) j++;
    const avg = (i + j) / 2 + 1;
    for (let k = i; k <= j; k++) ranks[k] = avg;
    tie.push(j - i + 1); i = j + 1;
  }
  let R1 = 0;
  for (let k = 0; k < all.length; k++) if (all[k][0] === "x") R1 += ranks[k];
  const U1 = R1 - (n1 * (n1 + 1)) / 2, U2 = n1 * n2 - U1, U = Math.min(U1, U2);
  const mu = (n1 * n2) / 2, N = n1 + n2;
  const tieTerm = tie.reduce((a, t) => a + (t ** 3 - t), 0);
  const sigma = Math.sqrt(((n1 * n2) / 12) * (N + 1 - tieTerm / (N * (N - 1))));
  const z = sigma > 0 ? (U - mu) / sigma : 0;
  const p = Math.min(1, Math.max(0, 2 * (1 - normCdf(Math.abs(z)))));
  let gt = 0, lt = 0;
  for (const a of x) for (const b of y) (a > b ? gt++ : a < b ? lt++ : 0);
  return { U, z, p, cliffs: (gt - lt) / (n1 * n2) };
}
function cliffMag(d) { const a = Math.abs(d); return a < 0.147 ? "negligible" : a < 0.33 ? "small" : a < 0.474 ? "medium" : "large"; }
function holm(tests) {
  const order = tests.map((t, i) => [t.p, i]).sort((a, b) => a[0] - b[0]);
  const m = tests.length; let prev = 0;
  order.forEach(([p, i], rank) => {
    const adj = Math.min(1, Math.max(prev, (m - rank) * p));
    tests[i].pAdj = adj; tests[i].significant = adj < ALPHA; prev = adj;
  });
  return tests;
}

// ---- enumerate dimensions present ----
const profiles = [...new Set(measured.map(prof))];
const pages = [...new Set(measured.map((r) => r[idx.page]))];
const scenarios = [...new Set(measured.map((r) => r[idx.scenario]))];
const metricByScenario = {};
for (const r of measured) (metricByScenario[r[idx.scenario]] ??= new Set()).add(r[idx.metric]);
const g = (pf, arm, page, sc, m) => groups.get(`${pf}|${arm}|${page}|${sc}|${m}`);

// ---- significance tests (tide vs each competitor), per profile ----
const tests = [];
for (const pf of profiles) {
  const family = [];
  for (const sc of scenarios) {
    for (const m of metricByScenario[sc]) {
      for (const page of pages) {
        const tideArr = g(pf, "tide", page, sc, m);
        if (!tideArr) continue;
        for (const comp of COMPETITORS) {
          const compArr = g(pf, comp, page, sc, m);
          if (!compArr || tideArr.length < 3 || compArr.length < 3) continue;
          const mw = mannWhitney(tideArr, compArr);
          family.push({ profile: pf, scenario: sc, metric: m, page, comp,
            medianTide: percentile(sortNum(tideArr), 50), medianComp: percentile(sortNum(compArr), 50), ...mw });
        }
      }
    }
  }
  holm(family);
  tests.push(...family);
}

// ---- meta ----
let meta = {};
try { meta = JSON.parse(readFileSync(join(__dirname, "..", "driver", "results-meta.json"), "utf8")); } catch {}
let bundle = [];
try {
  const t1 = JSON.parse(readFileSync(join(__dirname, "..", "tier1-bundle", "results.json"), "utf8"));
  bundle = Array.isArray(t1) ? t1 : (t1.results ?? []);
} catch {}

// ---- summary.md ----
let md = `# Tide benchmark — analysis\n\nGenerated ${new Date().toISOString()} from \`${CSV.split(/[\\/]/).pop()}\`.\nWarmup trials discarded. Lower is better for all latency/size metrics.\n`;
md += `\nProfiles: ${profiles.join(", ")} · arms: ${ARMS.join(", ")} · pages: ${pages.length}.\n`;
if (meta.seed != null) md += `Latest run: seed=${meta.seed}, N=${meta.n} (+${meta.warmup} warmup), tide \`${(meta.tideGitRev ?? "").slice(0, 9)}\`.\n`;

for (const pf of profiles) {
  md += `\n---\n\n## Profile: ${pf}\n`;
  for (const sc of scenarios) {
    for (const m of [...metricByScenario[sc]].sort()) {
      md += `\n### ${sc} · ${m}\n\n| page | arm | n | median | p95 | p99 | IQR | min | max |\n|---|---|--:|--:|--:|--:|--:|--:|--:|\n`;
      for (const page of pages) for (const arm of ARMS) {
        const arr = g(pf, arm, page, sc, m);
        if (!arr) continue;
        const d = describe(arr); const f = (x) => (x == null ? "—" : x.toFixed(2));
        md += `| ${page} | ${arm} | ${d.n} | ${f(d.median)} | ${f(d.p95)} | ${f(d.p99)} | ${f(d.iqr)} | ${f(d.min)} | ${f(d.max)} |\n`;
      }
    }
  }
}
md += `\n---\n\n## Significance — Tide vs competitors (Mann-Whitney U, Holm-Bonferroni per profile, α=${ALPHA})\n\n`;
md += `| profile | scenario | metric | page | vs | med Tide | med comp | Cliff's δ | mag | p(adj) | sig |\n|---|---|---|---|---|--:|--:|--:|---|--:|:--:|\n`;
for (const t of tests) {
  md += `| ${t.profile} | ${t.scenario} | ${t.metric} | ${t.page} | ${t.comp} | ${t.medianTide?.toFixed(2)} | ${t.medianComp?.toFixed(2)} | ${t.cliffs.toFixed(2)} | ${cliffMag(t.cliffs)} | ${t.pAdj.toFixed(4)} | ${t.significant ? "✓" : ""} |\n`;
}
writeFileSync(join(__dirname, "summary.md"), md);

// ---- benchmark.json (schema tide-bench/v1, §18) ----
const metricMeta = {
  "ttdp_ms": { label: "Time-to-data-painted", unit: "ms", lowerIsBetter: true },
  "fcp_ms": { label: "First Contentful Paint", unit: "ms", lowerIsBetter: true },
  "update_to_dom_ms": { label: "Update → DOM", unit: "ms", lowerIsBetter: true },
  "js_heap_mb": { label: "JS heap (steady)", unit: "MB", lowerIsBetter: true },
  "long_tasks": { label: "Long tasks", unit: "count", lowerIsBetter: true },
};
const cells = [];
for (const [key, arr] of groups) {
  const [profile, arm, page, scenario, metric] = key.split("|");
  const d = describe(arr);
  cells.push({ profile, arm, page, scenario, metric, ...d, samples: arr });
}
const benchmark = {
  schema: "tide-bench/v1",
  meta: {
    seed: meta.seed, n: meta.n, warmup: meta.warmup, generatedAt: new Date().toISOString(),
    tideGitRev: meta.tideGitRev, versions: meta.harnessVersions, profiles,
  },
  arms: ARMS,
  pages: pages.map((id) => ({ id })),
  metrics: [...new Set(cells.map((c) => `${c.scenario}.${c.metric}`))].map((sm) => {
    const [scenario, metric] = sm.split(".");
    return { id: sm, scenario, metric, ...(metricMeta[metric] ?? { label: metric, unit: "", lowerIsBetter: true }) };
  }),
  cells,
  comparisons: tests,
  bundle,
};
writeFileSync(join(__dirname, "benchmark.json"), JSON.stringify(benchmark));
writeFileSync(join(__dirname, "stats.json"), JSON.stringify({ meta, profiles, tests }, null, 2));

// ---- SVG box plots ----
function boxStats(arr) {
  const s = sortNum(arr);
  return { q1: percentile(s, 25), med: percentile(s, 50), q3: percentile(s, 75), p5: percentile(s, 5), p95: percentile(s, 95), n: s.length };
}
function svgBox(pf, page, sc, metric) {
  const series = ARMS.map((arm) => ({ arm, arr: g(pf, arm, page, sc, metric) })).filter((s) => s.arr && s.arr.length);
  if (series.length < 2) return null;
  const W = 520, H = 300, padL = 56, padR = 16, padT = 36, padB = 46;
  const all = series.flatMap((s) => s.arr);
  let max = Math.max(...all), min = Math.min(...all);
  if (max === min) max = min + 1;
  const pad = (max - min) * 0.1; max += pad; min = Math.max(0, min - pad);
  const y = (v) => padT + (H - padT - padB) * (1 - (v - min) / (max - min));
  const bw = (W - padL - padR) / series.length;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="system-ui,sans-serif" font-size="11"><rect width="${W}" height="${H}" fill="white"/>`;
  svg += `<text x="${W / 2}" y="18" text-anchor="middle" font-size="13" font-weight="600">${pf} · ${page} · ${sc} · ${metric}</text>`;
  for (let k = 0; k <= 4; k++) {
    const v = min + ((max - min) * k) / 4, yy = y(v);
    svg += `<line x1="${padL}" y1="${yy}" x2="${W - padR}" y2="${yy}" stroke="#eee"/><text x="${padL - 6}" y="${yy + 3}" text-anchor="end" fill="#666">${v.toFixed(1)}</text>`;
  }
  series.forEach((s, i) => {
    const b = boxStats(s.arr), cx = padL + bw * (i + 0.5), half = Math.min(34, bw * 0.3), c = COLORS[s.arm] ?? "#666";
    svg += `<line x1="${cx}" y1="${y(b.p5)}" x2="${cx}" y2="${y(b.p95)}" stroke="${c}" stroke-width="1.5"/>`;
    svg += `<rect x="${cx - half}" y="${y(b.q3)}" width="${half * 2}" height="${Math.max(1, y(b.q1) - y(b.q3))}" fill="${c}22" stroke="${c}" stroke-width="1.5"/>`;
    svg += `<line x1="${cx - half}" y1="${y(b.med)}" x2="${cx + half}" y2="${y(b.med)}" stroke="${c}" stroke-width="2.5"/>`;
    svg += `<text x="${cx}" y="${H - padB + 16}" text-anchor="middle" font-weight="600">${s.arm}</text>`;
    svg += `<text x="${cx}" y="${H - padB + 30}" text-anchor="middle" fill="#888">n=${b.n}·${b.med.toFixed(1)}</text>`;
  });
  return svg + `</svg>`;
}
let figCount = 0; const figIndex = [];
for (const pf of profiles) for (const sc of scenarios) for (const m of metricByScenario[sc]) for (const page of pages) {
  const svg = svgBox(pf, page, sc, m);
  if (!svg) continue;
  const name = `${pf}_${sc}_${m}_${page}.svg`;
  writeFileSync(join(FIG, name), svg); figIndex.push(name); figCount++;
}
writeFileSync(join(FIG, "index.json"), JSON.stringify(figIndex, null, 2));

console.log(`analysis: ${profiles.length} profile(s), ${groups.size} groups, ${tests.length} comparisons, ${figCount} figures`);
console.log(`  -> summary.md, stats.json, benchmark.json, figures/*.svg`);
console.log(`  significant (Holm-adj): ${tests.filter((t) => t.significant).length}/${tests.length}`);
