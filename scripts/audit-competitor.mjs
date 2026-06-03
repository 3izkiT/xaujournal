import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT = path.join(process.cwd(), "docs", "competitor-audit");
const BASE = "https://xaujournal.vercel.app";
const EMAIL = process.env.XAU_AUDIT_EMAIL ?? "hashtag.edmin@gmail.com";
const PASS = process.env.XAU_AUDIT_PASS ?? "11111111";

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const log = (msg) => {
  console.log(msg);
  fs.appendFileSync(path.join(OUT, "log.txt"), `${msg}\n`);
};

fs.writeFileSync(path.join(OUT, "log.txt"), "");

await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(1500);

// Switch from register to sign-in if needed
const signInTab = page.getByText("Sign in", { exact: true });
if (await signInTab.count()) {
  await signInTab.first().click({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(500);
}

const alreadyMember = page.getByText(/already a member/i);
if (await alreadyMember.count()) {
  await page.getByRole("link", { name: /sign in/i }).first().click({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(500);
}

await page.locator('input[type="email"]').first().fill(EMAIL);
await page.locator('input[type="password"]').first().fill(PASS);

await page.screenshot({ path: path.join(OUT, "before-submit.png") });

const loginBtn = page.getByRole("button", { name: /^login$/i });
if (await loginBtn.count()) {
  await loginBtn.first().click();
} else {
  await page.locator('button[type="submit"]').first().click();
}

await page.waitForTimeout(6000);

const url = page.url();
log(`URL after login: ${url}`);
await page.screenshot({ path: path.join(OUT, "after-login.png"), fullPage: true });

if (!url.includes("/app")) {
  const errText = await page.locator('[role="alert"], .error, text=/invalid|incorrect|wrong/i').allTextContents().catch(() => []);
  log(`Still on login. Alerts: ${errText.join(" | ") || "(none)"}`);
  await browser.close();
  process.exit(1);
}

const hrefs = await page.$$eval("a[href]", (as) =>
  [...new Set(as.map((a) => a.getAttribute("href")).filter(Boolean))].sort()
);
fs.writeFileSync(path.join(OUT, "hrefs-all.txt"), hrefs.join("\n"));

const appRoutes = hrefs.filter((h) => h.startsWith("/app") || h === "/app");
fs.writeFileSync(path.join(OUT, "app-routes.txt"), appRoutes.join("\n"));
log(`App routes: ${appRoutes.length}`);

const navPaths = appRoutes.length
  ? appRoutes
  : ["/app", "/app/analytics", "/app/calendar", "/app/journal", "/app/history", "/app/sync"];

for (const href of navPaths) {
  const slug = href.replace(/^\//, "").replace(/\//g, "_") || "app";
  try {
    log(`Visiting ${href}`);
    await page.goto(`${BASE}${href}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(OUT, `${slug}.png`), fullPage: true });
    const headings = await page.locator("h1, h2").allTextContents();
    fs.appendFileSync(path.join(OUT, "page-titles.txt"), `\n## ${href}\n${headings.slice(0, 8).join("\n")}\n`);
  } catch (e) {
    log(`Error ${href}: ${e.message}`);
  }
}

log("Done");
await browser.close();
