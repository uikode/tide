// Pilot verification (plan Step 5): confirms each harness renders REAL data (not
// skeleton) and that the WS Update->DOM path fires, for all three data layers.
// Foundation for the full collector (collect.mjs).
//
// Prereqs: fixture server on :20140 (bun run ../fixture-server/server.ts) and the
// built harnesses served on :20150 (cd ../harnesses && bun run preview).
import { chromium } from "playwright";

const PREVIEW = "http://localhost:20150";
const FIXTURE = "http://127.0.0.1:20140";
const HARNESSES = [
  { name: "tide", html: "tide.html" },
  { name: "tanstack", html: "tanstack.html" },
  { name: "swr", html: "swr.html" },
];
const PAGES = [
  { route: "dashboard", marker: ".card", min: 3 },
  { route: "gateways", marker: ".row", min: 5 },
  { route: "daemon", marker: ".row", min: 5 },
  { route: "stack", marker: ".row", min: 3 },
];

const RESET = () => {
  window.__bench.painted = [];
  window.__bench.wsRecv = [];
  performance.clearMarks("data-painted");
  performance.clearMarks("ws-recv");
};

async function waitPainted(page, t = 6000) {
  await page.waitForFunction(() => window.__bench && window.__bench.painted.length > 0, null, { timeout: t });
}

async function run() {
  const browser = await chromium.launch();
  const results = [];
  let failures = 0;

  for (const h of HARNESSES) {
    for (const p of PAGES) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const page = await ctx.newPage();
      const url = `${PREVIEW}/${h.html}#/${p.route}`;
      try {
        // COLD: load, clear all storage, hard reload => true cold render
        await page.goto(url, { waitUntil: "load" });
        await page.evaluate(() => {
          sessionStorage.clear();
          localStorage.clear();
        });
        await page.reload({ waitUntil: "load" });
        await waitPainted(page);

        const cold = await page.evaluate(() => {
          const m = performance.getEntriesByName("data-painted");
          return { ttdp: m.length ? m[0].startTime : null, harness: window.__bench.harness };
        });
        const rendered = await page.locator(p.marker).count();
        const realData = rendered >= p.min;

        // UPDATE: reset marks, broadcast a frozen update, measure Update->DOM
        await page.evaluate(RESET);
        await fetch(`${FIXTURE}/__broadcast?page=${p.route}`, { method: "POST" });
        let update = null;
        try {
          await page.waitForFunction(
            () => window.__bench.painted.length > 0 && window.__bench.wsRecv.length > 0,
            null,
            { timeout: 5000 },
          );
          update = await page.evaluate(() => {
            const recv = window.__bench.wsRecv[0];
            const painted = window.__bench.painted.find((x) => x >= recv) ?? window.__bench.painted.at(-1);
            return painted - recv;
          });
        } catch {
          update = null; // update path failed to propagate
        }

        const ok = realData && cold.ttdp != null && update != null;
        if (!ok) failures++;
        results.push({
          harness: h.name,
          page: p.route,
          coldTTDP: cold.ttdp,
          rendered,
          realData,
          updateToDom: update,
          ok,
        });
      } catch (e) {
        failures++;
        results.push({ harness: h.name, page: p.route, error: String(e).split("\n")[0], ok: false });
      } finally {
        await ctx.close();
      }
    }
  }

  await browser.close();

  console.log("\n=== PILOT VERIFICATION ===");
  for (const r of results) {
    if (r.error) {
      console.log(`✗ ${r.harness}/${r.page}  ERROR: ${r.error}`);
    } else {
      console.log(
        `${r.ok ? "✓" : "✗"} ${r.harness.padEnd(9)} ${r.page.padEnd(10)} ` +
          `coldTTDP=${r.coldTTDP?.toFixed(1).padStart(7)}ms  rendered=${String(r.rendered).padStart(3)} ` +
          `realData=${r.realData}  update→DOM=${r.updateToDom != null ? r.updateToDom.toFixed(2) + "ms" : "FAIL"}`,
      );
    }
  }
  console.log(`\n${results.length - failures}/${results.length} cells OK`);
  process.exit(failures ? 1 : 0);
}

run();
