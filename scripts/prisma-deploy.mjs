/**
 * Production migrate deploy with auto-recovery for failed 0004_auth_email (P3009).
 * Used by Vercel buildCommand.
 */
import { spawnSync } from "node:child_process";

function run(args, inherit = false) {
  const result = spawnSync("npx", args, {
    encoding: "utf8",
    stdio: inherit ? "inherit" : "pipe",
    env: process.env,
  });
  return result;
}

function migrateDeploy() {
  return run(["prisma", "migrate", "deploy"]);
}

let result = migrateDeploy();

if (result.status === 0) {
  process.exit(0);
}

const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;

if (output.includes("P3009") && output.includes("0004_auth_email")) {
  console.warn("[prisma-deploy] Recovering failed migration 0004_auth_email…");
  const resolve = run(["prisma", "migrate", "resolve", "--rolled-back", "0004_auth_email"], true);
  if (resolve.status !== 0) {
    process.exit(resolve.status ?? 1);
  }
  result = migrateDeploy();
  if (result.status === 0) {
    process.exit(0);
  }
}

if (result.stdout) process.stderr.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
process.exit(result.status ?? 1);
