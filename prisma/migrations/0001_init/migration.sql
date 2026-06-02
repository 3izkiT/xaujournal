-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PREMIUM_GOLD');

-- CreateEnum
CREATE TYPE "TradeType" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('LONDON', 'NEW_YORK', 'ASIAN');

-- CreateEnum
CREATE TYPE "EmotionType" AS ENUM ('CALM', 'GREED', 'FEAR', 'FOMO', 'REVENGE_TRADING', 'OVERLOT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "asset" TEXT NOT NULL DEFAULT 'XAUUSD (Gold)',
    "date" TIMESTAMP(3) NOT NULL,
    "type" "TradeType" NOT NULL,
    "netProfitLoss" DECIMAL(12,2) NOT NULL,
    "rMultiple" TEXT NOT NULL,
    "entryPrice" DECIMAL(10,2) NOT NULL,
    "exitPrice" DECIMAL(10,2) NOT NULL,
    "session" "SessionType" NOT NULL,
    "setupTags" TEXT[],
    "emotion" "EmotionType" NOT NULL,
    "beforeChartUrl" TEXT NOT NULL,
    "afterChartUrl" TEXT NOT NULL,
    "followedPlan" BOOLEAN NOT NULL,
    "rrAtLeastOneToTwo" BOOLEAN NOT NULL,
    "calmMindset" BOOLEAN NOT NULL,
    "disciplineScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Trade_userId_date_idx" ON "Trade"("userId", "date" DESC);

-- CreateIndex
CREATE INDEX "Trade_userId_session_idx" ON "Trade"("userId", "session");

-- CreateIndex
CREATE INDEX "Trade_userId_disciplineScore_idx" ON "Trade"("userId", "disciplineScore");

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
