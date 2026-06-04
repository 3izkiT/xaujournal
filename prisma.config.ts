import { defineConfig } from "prisma/config";

/**
 * Prisma CLI config (replaces deprecated package.json#prisma).
 * DATABASE_URL is optional for `prisma generate` in CI; required for migrate.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
