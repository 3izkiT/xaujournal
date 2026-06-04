/**
 * Visual full-system E2E — saves screenshots + video for review.
 *
 * Local headed (see browser on your machine):
 *   npm run test:e2e:visual:headed
 *
 * Headless + artifacts (for CI / cloud agent):
 *   npm run test:e2e:visual
 *
 * Production:
 *   E2E_BASE_URL=https://xaurite.vercel.app npm run test:e2e:visual
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const HEADED = process.env.E2E_HEADED === "1";
const SLOW_MO = Number(process.env.E2E_SLOW_MO ?? (HEADED ? 400 : 0));
const OUT = path.resolve("test-artifacts/visual-run");
const DEMO_EMAIL = "demo@xaurite.app";
const DEMO_PASSWORD = "xaurite2026";

const log = [];

function step(name, ok, detail = "") {
  log.push({ name, ok, detail });
  const mark = ok ? "✓" : "✗";
  console.log(`${mark} ${name}${detail ? ` — ${detail}` : ""}`);
}

async function shot(page, name) {
  const file = path.join(OUT, "screenshots", `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  return file;
}

async function run() {
  await mkdir(path.join(OUT, "screenshots"), { recursive: true });

  const browser = await chromium.launch({
    headless: !HEADED,
    slowMo: SLOW_MO,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: HEADED
      ? undefined
      : { dir: path.join(OUT, "video"), size: { width: 1440, height: 900 } },
  });

  const page = await context.newPage();

  try {
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await shot(page, "01-landing");
    step("Landing page", true, BASE);

    await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
    await shot(page, "02-login");

    const loginRes = await page.request.post(`${BASE}/api/auth/login`, {
      data: { email: DEMO_EMAIL, password: DEMO_PASSWORD },
    });

    if (loginRes.status() !== 200) {
      await shot(page, "02b-login-failed");
      step("Demo login", false, `HTTP ${loginRes.status()}`);
      throw new Error("Demo login failed — set NEXT_PUBLIC_DEMO_AUTH_ENABLED or use local .env");
    }

    step("Demo login API", true);
    await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await shot(page, "03-dashboard");
    step("Dashboard", true);

    const journalPages = [
      ["04-journal-entry", "/journal-entry"],
      ["05-history", "/history"],
      ["06-calendar", "/calendar"],
      ["07-analytics", "/analytics"],
      ["08-gallery", "/gallery"],
      ["09-settings", "/settings"],
      ["10-pricing", "/pricing"],
    ];

    for (const [file, route] of journalPages) {
      await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);
      await shot(page, file);
      step(`Page ${route}`, true);
    }

    await page.goto(`${BASE}/settings`, { waitUntil: "networkidle" });
    const lang = page.locator('select[aria-label="Language"]').first();
    if ((await lang.count()) > 0) {
      await lang.selectOption("th");
      await page.waitForTimeout(800);
      await shot(page, "11-settings-thai-locale");
      step("Thai locale", true);
    } else {
      step("Thai locale", false, "Language switcher not found");
    }

    await page.goto(`${BASE}/history`, { waitUntil: "networkidle" });
    const edit = page.locator('button:has-text("Edit")').first();
    if ((await edit.count()) > 0) {
      await edit.click();
      await page.waitForTimeout(800);
      await shot(page, "12-history-edit-modal");
      step("Trade edit UI", true);
    } else {
      step("Trade edit UI", false, "No Edit button");
    }

    await page.request.post(`${BASE}/api/auth/logout`);
    await page.goto(`${BASE}/dashboard`);
    await page.waitForURL(/\/login/, { timeout: 10000 });
    await shot(page, "13-logged-out-redirect");
    step("Logout redirect", true);
  } catch (err) {
    step("Run aborted", false, err.message);
    try {
      await shot(page, "99-error-state");
    } catch {
      /* ignore */
    }
  }

  await writeFile(
    path.join(OUT, "report.json"),
    JSON.stringify({ base: BASE, headed: HEADED, steps: log }, null, 2)
  );

  await page.close();
  await context.close();
  await browser.close();

  console.log("\n--- Artifacts ---");
  console.log(`Screenshots: ${path.join(OUT, "screenshots")}`);
  console.log(`Video:       ${path.join(OUT, "video")} (headless only)`);
  console.log(`Report:      ${path.join(OUT, "report.json")}`);

  if (HEADED) {
    console.log("\nHeaded mode: browser opened on YOUR machine — you saw it live.");
  } else {
    console.log("\nOpen screenshots folder to review each step visually.");
    console.log("Or run: npm run test:e2e:visual:headed");
  }

  const failed = log.filter((x) => !x.ok).length;
  process.exit(failed ? 1 : 0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
