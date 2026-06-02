-- CreateEnum
CREATE TYPE "RiskModel" AS ENUM ('FIXED_LOT', 'FIXED_PERCENT', 'VOLATILITY');

-- CreateEnum
CREATE TYPE "TemplatePreset" AS ENUM ('SCALP', 'INTRADAY', 'SWING');

-- AlterTable Trade
ALTER TABLE "Trade" ADD COLUMN "entryAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Trade" ADD COLUMN "exitAt" TIMESTAMP(3);
ALTER TABLE "Trade" ADD COLUMN "holdTimeMinutes" INTEGER;
ALTER TABLE "Trade" ADD COLUMN "mae" DECIMAL(12,2);
ALTER TABLE "Trade" ADD COLUMN "mfe" DECIMAL(12,2);
ALTER TABLE "Trade" ADD COLUMN "noteContext" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Trade" ADD COLUMN "noteMistake" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Trade" ADD COLUMN "noteNextAction" TEXT NOT NULL DEFAULT '';

UPDATE "Trade" SET "entryAt" = "date" WHERE "entryAt" IS NOT NULL;

-- CreateTable UserSettings
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customChecklist" JSONB,
    "customSetupTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "customErrorTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "riskModel" "RiskModel" NOT NULL DEFAULT 'FIXED_PERCENT',
    "templatePreset" "TemplatePreset" NOT NULL DEFAULT 'INTRADAY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable ShareLink
CREATE TABLE "ShareLink" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT 'Coach view',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShareLink_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");
CREATE UNIQUE INDEX "ShareLink_token_key" ON "ShareLink"("token");
CREATE INDEX "ShareLink_userId_idx" ON "ShareLink"("userId");
CREATE INDEX "Trade_userId_entryAt_idx" ON "Trade"("userId", "entryAt");

ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ShareLink" ADD CONSTRAINT "ShareLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
