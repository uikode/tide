// Analysis (plan Step 7 + §5). Distribution-aware, nonparametric, with effect
// sizes and multiple-comparison correction. Self-contained (no Python/scipy) so
// it runs anywhere Bun/Node does; methods implemented explicitly and documented.
//
//   - per (harness,page,scenario,metric): n, median(p50), p95, p99, IQR, min, max, mean
//   - pairwise tide vs {tanstack,swr}: Mann-Whitney U + normal approx p (tie-corrected)
//     + Cliff's delta effect size + median difference
//   - Holm-Bonferroni correction across the comparison family (alpha=0.05)
//   - SVG box plots per (page,scenario,metric), colorblind-safe, n shown
//
// Warmup rows (trial == "warmup") are DISCARDED here (documented in the paper).
//
// Usage: node analyze.mjs [../driver/results.csv]
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CSV = process.argv[2] ?? join(__dirname, "..", "driver", "results.csv");
const FIG = join(__dirname, "figures");
mkdirSync(FIG, { recursive: true });

const ALPHA = 0.05;
const COMPETITORS = ["tanstack", "swr"];
// colorblind-safe (Okabe-Ito)
const COLORS = { tide: "#0072B2", tanstack: "#E69F00", swr: "#009E73" };

// ---- load ----
const lines = readFileSync(CSV, "utf8").trim().split(/\r?\n/);
const header = lines[0].split(",");
const idx = Object.fromEntries(header.map((h, i) => [h, i]));
const rows = lines.slice(1).map((l) => l.split(","));
const measured = rows.filter((r) => r[idx.trial] !== "warmup");

// group: key = harness|page|scenario|metric -> number[]
const groups = new Map();
for (const r of measured) {
  const key = `${r[idx.harness]}|${r[idx.page]}|${r[idx.scenario]}|${r[idx.metric]}`;
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
  const lo = Math.floor(i),
    hi = Math.ceil(i);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
}
function describe(arr) {
  const s = sortNum(arr);
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  return {
    n: arr.length,
    median: percentile(s, 50),
    p95: percentile(s, 95),
    p99: percentile(s, 99),
    iqr: percentile(s, 75) - percentile(s, 25),
    min: s[0],
    max: s[s.length - 1],
    mean,
  };
}
// Mann-Whitney U with normal approximation + tie correction. Returns { U, z, p, cliffs }.
function mannWhitney(x, y) {
  const n1 = x.length,
    n2 = y.length;
  const all = x.map((v) => ["x", v]).concat(y.map((v) => ["y", v]));
  all.sort((a, b) => a[1] - b[1]);
  // ranks with ties averaged
  const ranks = new Array(all.length);
  let i = 0;
  const tieGroups = [];
  while (i < all.length) {
    let j = i;
    while (j + 1 < all.length && all[j + 1][1] === all[i][1]) j++;
    const avg = (i + j) / 2 + 1; // 1-based average rank
    for (let k = i; k <= j; k++) ranks[k] = avg;
    tieGroups.push(j - i + 1);
    i = j + 1;
  }
  let R1 = 0;
  for (let k = 0; k < all.length; k++) if (all[k][0] === "x") R1 += ranks[k];
  const U1 = R1 - (n1 * (n1 + 1)) / 2;
  const U2 = n1 * n2 - U1;
  const U = Math.min(U1, U2);
  const mu = (n1 * n2) / 2;
  const N = n1 + n2;
  const tieTerm = tieGroups.reduce((a, t) => a + (t ** 3 - t), 0);
  const sigma = Math.sqrt(((n1 * n2) / 12) * (N + 1 - tieTerm / (N * (N - 1))));
  const z = sigma > 0 ? (U - mu) / sigma : 0;
  const p = 2 * (1 - normCdf(Math.abs(z)));
  // Cliff's delta = (#x>y - #x<y) / (n1*n2)
  let gt = 0,
    lt = 0;
  for (const a of x) for (const b of y) (a > b ? gt++ : a < b ? lt++ : 0);
  const cliffs = (gt - lt) / (n1 * n2);
  return { U, z, p: Math.min(1, Math.max(0, p)), cliffs };
}
function normCdf(z) {
  // Abramowitz-Stegun 7.1.26
  const t = 1 / (1 + 0.2316419 * z);
  const d = 0.3989422804014327 * Math.exp(-(z * z) / 2);
  const p = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return 1 - p;
}
function cliffMagnitude(d) {
  const a = Math.abs(d);
  if (a < 0.147) return "negligible";
  if (a < 0.33) return "small";
  if (a < 0.474) return "medium";
  return "large";
}
function holmBonferroni(tests) {
  const order = tests.map((t, i) => [t.p, i]).sort((a, b) => a[0] - b[0]);
  const m = tests.length;
  let prev = 0;
  order.forEach(([p, i], rank) => {
    const adj = Math.min(1, Math.max(prev, (m - rank) * p));
    tests[i].pAdj = adj;
    tests[i].significant = adj < ALPHA;
    prev = adj;
  });
  return tests;
}

// ---- enumerate cells ----
const pages = [...new Set(measured.map((r) => r[idx.page]))];
const scenarios = [...new Set(measured.map((r) => r[idx.scenario]))];
const metricByScenario = {};
for (const r of measured) {
  (metricByScenario[r[idx.scenario]] ??= new Set()).add(r[idx.metric]);
}

// ---- significance tests (tide vs competitors), lower-is-better metrics ----
const tests = [];
for (const scenario of scenarios) {
  for (const metric of metricByScenario[scenario]) {
    for (const page of pages) {
      const tideArr = groups.get(`tide|${page}|${scenario}|${metric}`);
      if (!tideArr) continue;
      for (const comp of COMPETITORS) {
        const compArr = groups.get(`${comp}|${page}|${scenario}|${metric}`);
        if (!compArr || tideArr.length < 3 || compArr.length < 3) continue;
        const mw = mannWhitney(tideArr, compArr);
        tests.push({
          scenario,
          metric,
          page,
          comp,
          medianTide: percentile(sortNum(tideArr), 50),
          medianComp: percentile(sortNum(compArr), 50),
          ...mw,
        });
      }
    }
  }
}
holmBonferroni(tests);

// ---- summary tables (markdown) ----
let md = `# Tide benchmark — analysis\n\nGenerated ${new Date().toISOString()} from \`${CSV.split(/[\\/]/).pop()}\`.\nWarmup trials discarded. Lower is better for all latency/size metrics.\n`;
let meta = {};
try {
  meta = JSON.parse(readFileSync(join(__dirname, "..", "driver", "results-meta.json"), "utf8"));
  md += `\n**Run:** seed=${meta.seed}, N=${meta.n} (+${meta.warmup} warmup), CPU throttle=${meta.cpuThrottle}x, tide commit \`${(meta.tideGitRev ?? "").slice(0, 9)}\`.\n`;
} catch {}

md += `\n## Descriptive statistics (ms unless noted)\n\n`;
for (const scenario of scenarios) {
  for (const metric of [...metricByScenario[scenario]].sort()) {
    md += `\n### ${scenario} · ${metric}\n\n| page | harness | n | median | p95 | p99 | IQR | min | max |\n|---|---|--:|--:|--:|--:|--:|--:|--:|\n`;
    for (const page of pages) {
      for (const h of ["tide", ...COMPETITORS]) {
        const arr = groups.get(`${h}|${page}|${scenario}|${metric}`);
        if (!arr) continue;
        const d = describe(arr);
        const f = (x) => (x == null ? "—" : x.toFixed(2));
        md += `| ${page} | ${h} | ${d.n} | ${f(d.median)} | ${f(d.p95)} | ${f(d.p99)} | ${f(d.iqr)} | ${f(d.min)} | ${f(d.max)} |\n`;
      }
    }
  }
}

md += `\n## Significance — Tide vs competitors (Mann-Whitney U, Holm-Bonferroni, α=${ALPHA})\n\n`;
md += `| scenario | metric | page | vs | median Tide | median comp | Cliff's δ | mag | p | p(adj) | sig |\n|---|---|---|---|--:|--:|--:|---|--:|--:|:--:|\n`;
for (const t of tests) {
  md += `| ${t.scenario} | ${t.metric} | ${t.page} | ${t.comp} | ${t.medianTide?.toFixed(2)} | ${t.medianComp?.toFixed(2)} | ${t.cliffs.toFixed(2)} | ${cliffMagnitude(t.cliffs)} | ${t.p.toFixed(4)} | ${t.pAdj.toFixed(4)} | ${t.significant ? "✓" : ""} |\n`;
}

writeFileSync(join(__dirname, "summary.md"), md);
writeFileSync(join(__dirname, "stats.json"), JSON.stringify({ meta, tests, groups: Object.fromEntries([...groups].map(([k, v]) => [k, describe(v)])) }, null, 2));

// ---- SVG box plots ----
function boxStats(arr) {
  const s = sortNum(arr);
  return { q1: percentile(s, 25), med: percentile(s, 50), q3: percentile(s, 75), p5: percentile(s, 5), p95: percentile(s, 95), n: s.length };
}
function svgBox(page, scenario, metric) {
  const series = ["tide", ...COMPETITORS]
    .map((h) => ({ h, arr: groups.get(`${h}|${page}|${scenario}|${metric}`) }))
    .filter((s) => s.arr && s.arr.length);
  if (series.length < 2) return null;
  const W = 460,
    H = 300,
    padL = 56,
    padR = 16,
    padT = 36,
    padB = 46;
  const all = series.flatMap((s) => s.arr);
  let max = Math.max(...all),
    min = Math.min(...all);
  if (max === min) max = min + 1;
  const pad = (max - min) * 0.1;
  max += pad;
  min = Math.max(0, min - pad);
  const y = (v) => padT + (H - padT - padB) * (1 - (v - min) / (max - min));
  const bw = (W - padL - padR) / series.length;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="system-ui,sans-serif" font-size="11">`;
  svg += `<rect width="${W}" height="${H}" fill="white"/>`;
  svg += `<text x="${W / 2}" y="18" text-anchor="middle" font-size="13" font-weight="600">${page} · ${scenario} · ${metric}</text>`;
  // y axis ticks
  for (let k = 0; k <= 4; k++) {
    const v = min + ((max - min) * k) / 4;
    const yy = y(v);
    svg += `<line x1="${padL}" y1="${yy}" x2="${W - padR}" y2="${yy}" stroke="#eee"/>`;
    svg += `<text x="${padL - 6}" y="${yy + 3}" text-anchor="end" fill="#666">${v.toFixed(1)}</text>`;
  }
  series.forEach((s, i) => {
    const b = boxStats(s.arr);
    const cx = padL + bw * (i + 0.5);
    const half = Math.min(36, bw * 0.3);
    const c = COLORS[s.h];
    // whiskers p5-p95
    svg += `<line x1="${cx}" y1="${y(b.p5)}" x2="${cx}" y2="${y(b.p95)}" stroke="${c}" stroke-width="1.5"/>`;
    svg += `<line x1="${cx - half / 2}" y1="${y(b.p95)}" x2="${cx + half / 2}" y2="${y(b.p95)}" stroke="${c}"/>`;
    svg += `<line x1="${cx - half / 2}" y1="${y(b.p5)}" x2="${cx + half / 2}" y2="${y(b.p5)}" stroke="${c}"/>`;
    // box q1-q3
    svg += `<rect x="${cx - half}" y="${y(b.q3)}" width="${half * 2}" height="${Math.max(1, y(b.q1) - y(b.q3))}" fill="${c}22" stroke="${c}" stroke-width="1.5"/>`;
    // median
    svg += `<line x1="${cx - half}" y1="${y(b.med)}" x2="${cx + half}" y2="${y(b.med)}" stroke="${c}" stroke-width="2.5"/>`;
    svg += `<text x="${cx}" y="${H - padB + 16}" text-anchor="middle" font-weight="600">${s.h}</text>`;
    svg += `<text x="${cx}" y="${H - padB + 30}" text-anchor="middle" fill="#888">n=${b.n} · med ${b.med.toFixed(1)}</text>`;
  });
  return svg + `</svg>`;
}
let figCount = 0;
const figIndex = [];
for (const scenario of scenarios) {
  for (const metric of metricByScenario[scenario]) {
    for (const page of pages) {
      const svg = svgBox(page, scenario, metric);
      if (!svg) continue;
      const name = `${scenario}_${metric}_${page}.svg`;
      writeFileSync(join(FIG, name), svg);
      figIndex.push(name);
      figCount++;
    }
  }
}
writeFileSync(join(FIG, "index.json"), JSON.stringify(figIndex, null, 2));

console.log(`analysis: ${groups.size} groups, ${tests.length} comparisons, ${figCount} figures`);
console.log(`  -> analysis/summary.md, analysis/stats.json, analysis/figures/*.svg`);
const sig = tests.filter((t) => t.significant).length;
console.log(`  significant (Holm-adj): ${sig}/${tests.length}`);
