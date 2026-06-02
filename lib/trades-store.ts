import { EmotionType, SessionType, TradeType } from "@prisma/client";
import { JournalTrade } from "@/lib/types";
import { prisma } from "@/lib/db";

function toSession(label: JournalTrade["session"]): SessionType {
  if (label === "London Session") return SessionType.LONDON;
  if (label === "New York Session") return SessionType.NEW_YORK;
  return SessionType.ASIAN;
}

function fromSession(session: SessionType): JournalTrade["session"] {
  if (session === SessionType.LONDON) return "London Session";
  if (session === SessionType.NEW_YORK) return "New York Session";
  return "Asian Session";
}

function toEmotion(label: JournalTrade["emotion"]): EmotionType {
  switch (label) {
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

function fromEmotion(emotion: EmotionType): JournalTrade["emotion"] {
  switch (emotion) {
    case EmotionType.CALM:
      return "Calm";
    case EmotionType.GREED:
      return "Greed";
    case EmotionType.FEAR:
      return "Fear";
    case EmotionType.FOMO:
      return "FOMO";
    case EmotionType.REVENGE_TRADING:
      return "Revenge Trading";
    default:
      return "Overlot";
  }
}

function toTradeType(type: JournalTrade["type"]): TradeType {
  return type === "Buy" ? TradeType.BUY : TradeType.SELL;
}

function fromTradeType(type: TradeType): JournalTrade["type"] {
  return type === TradeType.BUY ? "Buy" : "Sell";
}

export async function getTradesForUser(userId: string): Promise<JournalTrade[]> {
  const trades = await prisma.trade.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return trades.map((trade) => ({
    id: trade.id,
    asset: "XAUUSD (Gold)",
    date: trade.date.toISOString().slice(0, 10),
    type: fromTradeType(trade.type),
    netProfitLoss: Number(trade.netProfitLoss),
    rMultiple: trade.rMultiple,
    entryPrice: Number(trade.entryPrice),
    exitPrice: Number(trade.exitPrice),
    session: fromSession(trade.session),
    setupTags: trade.setupTags as JournalTrade["setupTags"],
    emotion: fromEmotion(trade.emotion),
    beforeChartUrl: trade.beforeChartUrl,
    afterChartUrl: trade.afterChartUrl,
    disciplineChecklist: {
      followedPlan: trade.followedPlan,
      rrAtLeastOneToTwo: trade.rrAtLeastOneToTwo,
      calmMindset: trade.calmMindset,
    },
    disciplineScore: trade.disciplineScore as JournalTrade["disciplineScore"],
  }));
}

export async function addTradeForUser(userId: string, trade: JournalTrade) {
  await prisma.trade.create({
    data: {
      userId,
      asset: trade.asset,
      date: new Date(trade.date),
      type: toTradeType(trade.type),
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
    },
  });
}
