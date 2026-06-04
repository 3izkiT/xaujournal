import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT = path.join(process.cwd(), "docs", "competitor-audit");
const BASE = "https://xaujournal.vercel.app";
const API_KEY = process.env.XAU_AUDIT_FIREBASE_API_KEY ?? "";
const EMAIL = process.env.XAU_AUDIT_EMAIL ?? "hashtag.edmin@gmail.com";
const PASS = process.env.XAU_AUDIT_PASS ?? "11111111";

fs.mkdirSync(OUT, { recursive: true });

if (!API_KEY) {
  console.error("Set XAU_AUDIT_FIREBASE_API_KEY to run this script.");
  process.exit(1);
}

const authRes = await fetch(
  `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASS, returnSecureToken: true }),
  }
);
const auth = await authRes.json();
if (auth.error) {
  console.error("Firebase auth failed:", auth.error.message);
  process.exit(1);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1500);

await page.evaluate(
  ({ apiKey, authData }) => {
    const key = `firebase:authUser:${apiKey}:[DEFAULT]`;
    const user = {
      uid: authData.localId,
      email: authData.email,
      emailVerified: true,
      displayName: authData.displayName || null,
      isAnonymous: false,
      providerData: [
        {
          providerId: "password",
          uid: authData.email,
          displayName: authData.displayName || null,
          email: authData.email,
          phoneNumber: null,
          photoURL: null,
        },
      ],
      stsTokenManager: {
        refreshToken: authData.refreshToken,
        accessToken: authData.idToken,
        expirationTime: Date.now() + Number(authData.expiresIn) * 1000,
      },
      createdAt: String(Date.now()),
      lastLoginAt: String(Date.now()),
    };
    localStorage.setItem(key, JSON.stringify(user));
  },
  { apiKey: API_KEY, authData: auth }
);

async function dismissOnboarding() {
  const skip = page.getByRole("button", { name: /skip setup/i });
  if (await skip.count()) {
    await skip.first().click();
    await page.waitForTimeout(1500);
    return true;
  }
  return false;
}

const routes = [
  { path: "/app", slug: "dashboard" },
  { path: "/app/analytics", slug: "analytics" },
  { path: "/app/calendar", slug: "calendar" },
  { path: "/app/journal", slug: "journal" },
  { path: "/app/history", slug: "history" },
  { path: "/app/sync", slug: "sync" },
];

const report = [];

for (const { path: routePath, slug } of routes) {
  await page.goto(`${BASE}${routePath}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2500);
  await dismissOnboarding();
  await page.waitForTimeout(1000);

  const sidebar = await page.locator("nav a, aside a, [class*='sidebar'] a").allTextContents().catch(() => []);
  const headings = await page.locator("h1, h2, h3").allTextContents().catch(() => []);

  await page.screenshot({ path: path.join(OUT, `${slug}.png`), fullPage: true });

  report.push({
    route: routePath,
    title: headings[0]?.trim() ?? "",
    headings: headings.slice(0, 12).filter(Boolean),
    nav: [...new Set(sidebar.map((t) => t.trim()).filter((t) => t.length > 1 && t.length < 40))].slice(0, 15),
  });
  console.log(`OK ${routePath} -> ${slug}.png`);
}

fs.writeFileSync(path.join(OUT, "audit-report.json"), JSON.stringify(report, null, 2));

const md = report
  .map(
    (r) =>
      `### ${r.route}\n- **Title:** ${r.title || "—"}\n- **Nav:** ${r.nav.join(" · ") || "—"}\n- **Headings:** ${r.headings.join(" | ") || "—"}\n`
  )
  .join("\n");

fs.writeFileSync(
  path.join(OUT, "AUDIT.md"),
  `# xaujournal.vercel.app audit\n\nLogged in via Firebase (${EMAIL}). Screenshots: \`${OUT}\`\n\n${md}`
);

console.log("Done");
await browser.close();
