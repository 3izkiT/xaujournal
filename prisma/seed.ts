import bcrypt from "bcryptjs";
import { EmotionType, Plan, PrismaClient, SessionType, TradeType } from "@prisma/client";
import { DEMO_EMAIL, DEMO_PASSWORD, LEGACY_DEMO_EMAIL } from "../lib/brand";
import { mockTrades } from "../lib/data";

const prisma = new PrismaClient();

function toSession(session: string): SessionType {
  if (session === "Sydney Session") return SessionType.SYDNEY;
  if (session === "Tokyo Session" || session === "Asian Session") return SessionType.TOKYO;
  if (session === "New York Session") return SessionType.NEW_YORK;
  return SessionType.LONDON;
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

async function ensureDemoUser() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const legacy = await prisma.user.findUnique({ where: { email: LEGACY_DEMO_EMAIL } });

  if (legacy) {
    return prisma.user.update({
      where: { id: legacy.id },
      data: {
        email: DEMO_EMAIL,
        name: "Demo Trader",
        passwordHash,
        plan: Plan.FREE,
      },
    });
  }

  return prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {
      name: "Demo Trader",
      passwordHash,
      plan: Plan.FREE,
    },
    create: {
      email: DEMO_EMAIL,
      name: "Demo Trader",
      passwordHash,
      plan: Plan.FREE,
    },
  });
}

async function main() {
  const demoUser = await ensureDemoUser();

  await prisma.trade.deleteMany({ where: { userId: demoUser.id } });

  await prisma.trade.createMany({
    data: mockTrades.map((trade) => ({
      userId: demoUser.id,
      asset: trade.asset,
      date: new Date(trade.date),
      entryAt: new Date(trade.entryAt),
      exitAt: trade.exitAt ? new Date(trade.exitAt) : null,
      holdTimeMinutes: trade.holdTimeMinutes,
      type: trade.type === "Buy" ? TradeType.BUY : TradeType.SELL,
      netProfitLoss: trade.netProfitLoss,
      rMultiple: trade.rMultiple,
      entryPrice: trade.entryPrice,
      exitPrice: trade.exitPrice,
      mae: trade.mae,
      mfe: trade.mfe,
      session: toSession(trade.session),
      setupTags: trade.setupTags,
      emotion: toEmotion(trade.emotion),
      beforeChartUrl: trade.beforeChartUrl,
      afterChartUrl: trade.afterChartUrl,
      followedPlan: trade.disciplineChecklist.followedPlan,
      rrAtLeastOneToTwo: trade.disciplineChecklist.rrAtLeastOneToTwo,
      calmMindset: trade.disciplineChecklist.calmMindset,
      disciplineScore: trade.disciplineScore,
      noteContext: trade.noteContext,
      noteMistake: trade.noteMistake,
      noteNextAction: trade.noteNextAction,
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
