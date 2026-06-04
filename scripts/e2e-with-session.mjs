/**
 * Run visual E2E on production using YOUR logged-in session.
 *
 * 1. Log in at https://xaurite.vercel.app (Google) in your browser
 * 2. DevTools → Application → Cookies → xaurite.vercel.app → copy `xauj_session` value
 * 3. Run (do NOT commit the cookie):
 *
 *    E2E_BASE_URL=https://xaurite.vercel.app \
 *    E2E_SESSION_COOKIE="paste-value-here" \
 *    node scripts/e2e-with-session.mjs
 *
 * Optional: E2E_HEADED=1 to watch the browser on your machine.
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.E2E_BASE_URL ?? "https://xaurite.vercel.app";
const SESSION = process.env.E2E_SESSION_COOKIE?.trim();
const HEADED = process.env.E2E_HEADED === "1";
const OUT = path.resolve("test-artifacts/your-session-run");

if (!SESSION) {
  console.error(`
Missing E2E_SESSION_COOKIE.

How to get it:
  1. Open https://xaurite.vercel.app and sign in with Google
  2. Press F12 → Application (Chrome) / Storage (Firefox)
  3. Cookies → https://xaurite.vercel.app → xauj_session
  4. Copy the Value (long string)

Then run:
  E2E_SESSION_COOKIE="..." node scripts/e2e-with-session.mjs

Security: treat this like a password. Do not commit it. Delete after testing.
`);
  process.exit(1);
}

async function shot(page, name) {
  const dir = path.join(OUT, "screenshots");
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log("  screenshot:", file);
  return file;
}

async function run() {
  const browser = await chromium.launch({ headless: !HEADED, slowMo: HEADED ? 300 : 0 });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const url = new URL(BASE);
  await context.addCookies([
    {
      name: "xauj_session",
      value: SESSION,
      domain: url.hostname,
      path: "/",
      httpOnly: true,
      secure: url.protocol === "https:",
      sameSite: "Lax",
    },
  ]);

  const page = await context.newPage();
  const steps = [];

  async function go(name, route) {
    const res = await page.goto(`${BASE}${route}`, { waitUntil: "networkidle", timeout: 30000 });
    const status = res?.status() ?? 0;
    if (status >= 400) throw new Error(`${route} HTTP ${status}`);
    await page.waitForTimeout(600);
    await shot(page, name);
    steps.push({ route, ok: true });
    console.log(`✓ ${route}`);
  }

  try {
    await go("01-dashboard", "/dashboard");

    const me = await page.request.get(`${BASE}/api/auth/me`);
    const meJson = await me.json().catch(() => ({}));
    console.log("  logged in as:", meJson.email ?? meJson.user?.email ?? "(check /api/auth/me)");

    for (const [file, route] of [
      ["02-journal-entry", "/journal-entry"],
      ["03-history", "/history"],
      ["04-settings", "/settings"],
      ["05-analytics", "/analytics"],
    ]) {
      await go(file, route);
    }

    const trades = await page.request.get(`${BASE}/api/trades`);
    const tradesJson = await trades.json().catch(() => ({}));
    const count = tradesJson.tradeCount ?? tradesJson.trades?.length ?? "?";
    console.log("  trades:", count);

    await writeFile(
      path.join(OUT, "report.json"),
      JSON.stringify({ base: BASE, email: meJson.email, tradeCount: count, steps }, null, 2)
    );
  } catch (err) {
    console.error("✗", err.message);
    await shot(page, "99-error");
    process.exit(1);
  }

  await browser.close();
  console.log(`\nDone. Screenshots in ${path.join(OUT, "screenshots")}`);
}

run();
