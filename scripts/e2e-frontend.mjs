/**
 * Full frontend smoke + auth flow for XAURite.
 * Run: node scripts/e2e-frontend.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const DEMO_EMAIL = "demo@xaurite.app";
const DEMO_PASSWORD = "xaurite2026";

const results = [];

function pass(name, detail = "") {
  results.push({ name, ok: true, detail });
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail = "") {
  results.push({ name, ok: false, detail });
  console.error(`✗ ${name}${detail ? ` — ${detail}` : ""}`);
}

async function expectStatus(page, path, status = 200) {
  const res = await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
  const code = res?.status() ?? 0;
  if (code !== status) {
    throw new Error(`${path} returned ${code}, expected ${status}`);
  }
}

async function loginDemo(page) {
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await page.fill('input[type="email"], input[name="email"], input[autocomplete="email"]', DEMO_EMAIL);
  await page.fill('input[type="password"]', DEMO_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/dashboard/, { timeout: 15000 });
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const publicRoutes = [
    ["/", "XAURite"],
    ["/login", "Sign in"],
    ["/register", "Create"],
    ["/privacy", "Privacy"],
    ["/terms", "Terms"],
    ["/forgot-password", "password"],
  ];

  for (const [path, needle] of publicRoutes) {
    try {
      await expectStatus(page, path);
      const body = await page.textContent("body");
      if (!body?.toLowerCase().includes(needle.toLowerCase())) {
        throw new Error(`missing text "${needle}"`);
      }
      pass(`Public page ${path}`, needle);
    } catch (err) {
      fail(`Public page ${path}`, err.message);
    }
  }

  try {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "domcontentloaded" });
    await page.waitForURL(/\/login/, { timeout: 8000 });
    pass("Protected /dashboard redirects to login");
  } catch (err) {
    fail("Protected /dashboard redirects to login", err.message);
  }

  try {
    await loginDemo(page);
    pass("Demo login", "redirected to /dashboard");
  } catch (err) {
    fail("Demo login", err.message);
    await browser.close();
    summarize();
    process.exit(1);
  }

  const journalRoutes = [
    "/dashboard",
    "/journal-entry",
    "/history",
    "/calendar",
    "/analytics",
    "/gallery",
    "/settings",
    "/pricing",
  ];

  for (const path of journalRoutes) {
    try {
      await expectStatus(page, path);
      const title = await page.title();
      pass(`Journal page ${path}`, title.slice(0, 60));
    } catch (err) {
      fail(`Journal page ${path}`, err.message);
    }
  }

  try {
    await page.goto(`${BASE}/settings`, { waitUntil: "networkidle" });
    const hasChecklist = (await page.locator("text=checklist").count()) > 0;
    const hasShare = (await page.locator("text=share").count()) > 0;
    pass("Settings page sections", `checklist=${hasChecklist} share=${hasShare}`);
  } catch (err) {
    fail("Settings page sections", err.message);
  }

  try {
    await page.goto(`${BASE}/journal-entry`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    const tagCount = await page.locator('input[type="radio"], button[type="button"]').count();
    pass("Journal entry form", `${tagCount} interactive controls`);
  } catch (err) {
    fail("Journal entry form", err.message);
  }

  try {
    await page.goto(`${BASE}/history`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    const tradeCards = await page.locator('[class*="trade"], table tbody tr, article').count();
    pass("History page loads trades", `${tradeCards} elements`);
  } catch (err) {
    fail("History page loads trades", err.message);
  }

  try {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
    const select = page.locator('select[aria-label="Language"]');
    if ((await select.count()) === 0) {
      throw new Error("Language switcher not found");
    }
    await select.selectOption("th");
    await page.waitForTimeout(1000);
    const cookie = (await context.cookies()).find((c) => c.name === "NEXT_LOCALE");
    if (cookie?.value !== "th") {
      throw new Error(`NEXT_LOCALE cookie is ${cookie?.value}`);
    }
    pass("Thai locale switch", "NEXT_LOCALE=th");
  } catch (err) {
    fail("Thai locale switch", err.message);
  }

  try {
    const res = await page.request.post(`${BASE}/api/auth/login`, {
      data: { email: DEMO_EMAIL, password: "wrong-password" },
    });
    if (res.status() !== 401) {
      throw new Error(`wrong password returned ${res.status()}`);
    }
    pass("Login API rejects bad password", "401");
  } catch (err) {
    fail("Login API rejects bad password", err.message);
  }

  try {
    await page.goto(`${BASE}/api/auth/logout`, { waitUntil: "domcontentloaded" }).catch(() => {});
    await page.request.post(`${BASE}/api/auth/logout`);
    await page.goto(`${BASE}/dashboard`, { waitUntil: "domcontentloaded" });
    await page.waitForURL(/\/login/, { timeout: 8000 });
    pass("Logout clears session");
  } catch (err) {
    fail("Logout clears session", err.message);
  }

  await browser.close();
  summarize();
  process.exit(results.some((r) => !r.ok) ? 1 : 0);
}

function summarize() {
  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  console.log("\n--- Summary ---");
  console.log(`Passed: ${passed}  Failed: ${failed}  Total: ${results.length}`);
  if (failed) {
    console.log("\nFailures:");
    for (const r of results.filter((x) => !x.ok)) {
      console.log(`  - ${r.name}: ${r.detail}`);
    }
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
