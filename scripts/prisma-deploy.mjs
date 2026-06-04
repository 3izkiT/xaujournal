/**
 * Production migrations for Vercel build.
 * - Uses DIRECT_DATABASE_URL via schema directUrl (avoid pooler advisory-lock timeouts).
 * - Retries on P1002 / advisory-lock contention (parallel deploys or stale sessions).
 */
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const MAX_ATTEMPTS = 5;
const RETRY_MS = 15_000;

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

function ensureDirectDatabaseUrl() {
  if (process.env.DIRECT_DATABASE_URL?.trim()) return;
  const fallback =
    process.env.DATABASE_URL_UNPOOLED?.trim() ||
    process.env.DIRECT_URL?.trim() ||
    process.env.DATABASE_URL?.trim();
  if (fallback) {
    process.env.DIRECT_DATABASE_URL = fallback;
  }
}

function logDirectUrlHint() {
  ensureDirectDatabaseUrl();
  const direct =
    process.env.DIRECT_DATABASE_URL?.trim() ||
    process.env.DATABASE_URL_UNPOOLED?.trim() ||
    process.env.DIRECT_URL?.trim();
  if (!direct) {
    console.warn(
      "[prisma-deploy] DIRECT_DATABASE_URL is not set. Migrations use DATABASE_URL only.",
    );
    console.warn(
      "[prisma-deploy] For Neon/Supabase, set DIRECT_DATABASE_URL to the non-pooled (session) connection to avoid P1002.",
    );
  } else {
    console.log("[prisma-deploy] Using DIRECT_DATABASE_URL for migrate (via prisma schema directUrl).");
  }
}

function migrateDatabaseUrl() {
  ensureDirectDatabaseUrl();
  return (
    process.env.DIRECT_DATABASE_URL?.trim() ||
    process.env.DATABASE_URL_UNPOOLED?.trim() ||
    process.env.DIRECT_URL?.trim() ||
    process.env.DATABASE_URL?.trim()
  );
}

function runMigrateDeploy() {
  const migrateUrl = migrateDatabaseUrl();
  const env = { ...process.env, DATABASE_URL: migrateUrl };
  return new Promise((resolve, reject) => {
    const child = spawn("npx", ["prisma", "migrate", "deploy"], {
      stdio: "inherit",
      env,
      shell: process.platform === "win32",
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`prisma migrate deploy exited with code ${code}`));
    });
  });
}

async function main() {
  if (!hasDatabaseUrl()) {
    console.log("[prisma-deploy] DATABASE_URL not set — skipping migrations.");
    process.exit(0);
  }

  logDirectUrlHint();

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      console.log(`[prisma-deploy] migrate deploy (${attempt}/${MAX_ATTEMPTS})…`);
      await runMigrateDeploy();
      console.log("[prisma-deploy] Migrations applied successfully.");
      process.exit(0);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[prisma-deploy] Attempt ${attempt} failed: ${message}`);
      if (attempt >= MAX_ATTEMPTS) {
        console.error(
          "[prisma-deploy] If you see P1002 advisory lock: cancel other deploys, set DIRECT_DATABASE_URL, or terminate stale locks in Postgres.",
        );
        process.exit(1);
      }
      console.warn(`[prisma-deploy] Retrying in ${RETRY_MS / 1000}s…`);
      await delay(RETRY_MS);
    }
  }
}

main();
