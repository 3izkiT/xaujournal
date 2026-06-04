/**
 * Responsive UI audit: horizontal overflow + screenshots per viewport.
 * Usage: node scripts/e2e-responsive.mjs [baseUrl]
 * Env: E2E_EMAIL, E2E_PASSWORD (defaults to demo)
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const BASE = process.argv[2] || process.env.E2E_BASE_URL || "https://xaurite.vercel.app";
const OUT = path.join(process.cwd(), "test-artifacts", "responsive-audit");

const VIEWPORTS = [
  { name: "mobile-se", width: 320, height: 568 },
  { name: "mobile-md", width: 390, height: 844 },
  { name: "mobile-lg", width: 430, height: 932 },
  { name: "tablet-portrait", width: 768, height: 1024 },
  { name: "tablet-landscape", width: 1024, height: 768 },
  { name: "laptop", width: 1280, height: 800 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "desktop-hd", width: 1920, height: 1080 },
  { name: "ultrawide", width: 2560, height: 1440 },
];

const PAGES = [
  { path: "/", name: "landing", auth: false },
  { path: "/login", name: "login", auth: false },
  { path: "/dashboard", name: "dashboard", auth: true },
  { path: "/history", name: "history", auth: true },
  { path: "/journal-entry", name: "journal-entry", auth: true },
  { path: "/gallery", name: "gallery", auth: true },
  { path: "/settings", name: "settings", auth: true },
];

async function login(page) {
  const email = process.env.E2E_EMAIL || "demo@xaurite.app";
  const password = process.env.E2E_PASSWORD || "xaurite2026";
  const res = await page.request.post(`${BASE}/api/auth/login`, {
    data: { email, password },
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok()) {
    throw new Error(`Login failed: ${res.status()} ${await res.text()}`);
  }
}

function overflowCheck() {
  return () => {
    const doc = document.documentElement;
    const body = document.body;
    const docOverflow = doc.scrollWidth - doc.clientWidth;
    const bodyOverflow = body.scrollWidth - body.clientWidth;
    return {
      docOverflow,
      bodyOverflow,
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      hasHorizontalScroll: docOverflow > 2 || bodyOverflow > 2,
    };
  };
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await login(page); // session cookie reused for all pages/viewports

  const report = { base: BASE, at: new Date().toISOString(), results: [] };

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const route of PAGES) {
      const url = `${BASE}${route.path}`;
      await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForTimeout(route.auth ? 1500 : 800);

      const overflow = await page.evaluate(overflowCheck());
      const shot = path.join(OUT, `${vp.name}--${route.name}.png`);
      await page.screenshot({ path: shot, fullPage: route.path === "/dashboard" });

      const entry = {
        viewport: vp.name,
        size: `${vp.width}x${vp.height}`,
        page: route.name,
        path: route.path,
        ...overflow,
        screenshot: shot,
      };
      report.results.push(entry);
      const flag = overflow.hasHorizontalScroll ? "FAIL" : "ok";
      console.log(`[${flag}] ${vp.name} ${route.name} overflow=${overflow.docOverflow}px`);
    }
  }

  const failures = report.results.filter((r) => r.hasHorizontalScroll);
  report.summary = {
    total: report.results.length,
    failures: failures.length,
    failed: failures.map((f) => `${f.viewport}/${f.page} (+${f.docOverflow}px)`),
  };

  await writeFile(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
  console.log("\n--- Summary ---");
  console.log(`Failures: ${failures.length} / ${report.results.length}`);
  failures.forEach((f) => console.log(`  - ${f.viewport} ${f.page}: +${f.docOverflow}px`));
  console.log(`Report: ${path.join(OUT, "report.json")}`);

  await browser.close();
  process.exit(failures.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
