#!/usr/bin/env node
/**
 * Run Lighthouse (performance, SEO, accessibility, best-practices) for key public URLs.
 * Usage:
 *   node scripts/lighthouse-audit.mjs
 *   LIGHTHOUSE_URL=https://xaurite.vercel.app node scripts/lighthouse-audit.mjs
 */
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const base = process.env.LIGHTHOUSE_URL ?? "https://xaurite.vercel.app";
const paths = ["", "/login", "/register", "/pricing", "/privacy", "/terms"];
const preset = process.env.LIGHTHOUSE_PRESET ?? "desktop";

const urls = paths.map((p) => `${base.replace(/\/$/, "")}${p}`);

async function runOne(url) {
  const slug = url.replace(/^https?:\/\//, "").replace(/\//g, "_") || "home";
  const out = `./lighthouse-${slug}-${preset}.json`;
  return new Promise((resolve, reject) => {
    const args = [
      url,
      "--quiet",
      "--chrome-flags=--headless",
      `--preset=${preset}`,
      "--only-categories=performance,accessibility,best-practices,seo",
      "--output=json",
      `--output-path=${out}`,
    ];
    const child = spawn("lighthouse", args, { stdio: "inherit", shell: true });
    child.on("close", (code) => (code === 0 ? resolve(out) : reject(new Error(`lighthouse failed ${url}`))));
  });
}

const reports = [];
for (const url of urls) {
  console.log(`\n▶ ${url} (${preset})`);
  try {
    const file = await runOne(url);
    reports.push(file);
  } catch (err) {
    console.error(err.message);
  }
}

writeFileSync(
  "./lighthouse-summary.json",
  JSON.stringify({ base, preset, reports, ranAt: new Date().toISOString() }, null, 2)
);
console.log("\nDone. Reports:", reports.join(", "));
