import bcrypt from "bcryptjs";
import { EmotionType, Plan, PrismaClient, SessionType, TradeType } from "@prisma/client";
import { mockTrades } from "../lib/data";

const prisma = new PrismaClient();

function toSession(session: string): SessionType {
  if (session === "London Session") return SessionType.LONDON;
  if (session === "New York Session") return SessionType.NEW_YORK;
  return SessionType.ASIAN;
}

function toEmotion(emotion: string): EmotionType {
  switch (emotion) {
    case "Calm":
      return EmotionType.CALM;
    case "Greed":
      return EmotionType.GREED;
    case "Fear":
      return EmotionType.FEAR;
    case "FOMO":
      return EmotionType.FOMO;
    case "Revenge Trading":
      return EmotionType.REVENGE_TRADING;
    default:
      return EmotionType.OVERLOT;
  }
}

async function main() {
  const passwordHash = await bcrypt.hash("xaujournal2026", 10);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@xaujournal.app" },
    update: {
      name: "Demo Trader",
      passwordHash,
      plan: Plan.FREE,
    },
    create: {
      email: "demo@xaujournal.app",
      name: "Demo Trader",
      passwordHash,
      plan: Plan.FREE,
    },
  });

  await prisma.trade.deleteMany({ where: { userId: demoUser.id } });

  await prisma.trade.createMany({
    data: mockTrades.map((trade) => ({
      userId: demoUser.id,
      asset: trade.asset,
      date: new Date(trade.date),
      type: trade.type === "Buy" ? TradeType.BUY : TradeType.SELL,
      netProfitLoss: trade.netProfitLoss,
      rMultiple: trade.rMultiple,
      entryPrice: trade.entryPrice,
      exitPrice: trade.exitPrice,
      session: toSession(trade.session),
      setupTags: trade.setupTags,
      emotion: toEmotion(trade.emotion),
      beforeChartUrl: trade.beforeChartUrl,
      afterChartUrl: trade.afterChartUrl,
      followedPlan: trade.disciplineChecklist.followedPlan,
      rrAtLeastOneToTwo: trade.disciplineChecklist.rrAtLeastOneToTwo,
      calmMindset: trade.disciplineChecklist.calmMindset,
      disciplineScore: trade.disciplineScore,
    })),
  });

  console.log("Seed completed: demo user + sample trades.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
