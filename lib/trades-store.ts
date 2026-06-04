import { EmotionType, Plan, SessionType, TradeType } from "@prisma/client";

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



function mapTrade(trade: {

  id: string;

  date: Date;

  entryAt: Date;

  exitAt: Date | null;

  holdTimeMinutes: number | null;

  type: TradeType;

  netProfitLoss: { toNumber?: () => number } | number | string;

  rMultiple: string;

  entryPrice: { toNumber?: () => number } | number | string;

  exitPrice: { toNumber?: () => number } | number | string;

  mae: { toNumber?: () => number } | number | string | null;

  mfe: { toNumber?: () => number } | number | string | null;

  session: SessionType;

  setupTags: string[];

  emotion: EmotionType;

  beforeChartUrl: string;

  afterChartUrl: string;

  followedPlan: boolean;

  rrAtLeastOneToTwo: boolean;

  calmMindset: boolean;

  disciplineScore: number;

  noteContext: string;

  noteMistake: string;

  noteNextAction: string;

}): JournalTrade {

  const num = (v: { toNumber?: () => number } | number | string | null) =>

    v == null ? null : typeof v === "object" && "toNumber" in v && v.toNumber ? v.toNumber() : Number(v);



  return {

    id: trade.id,

    asset: "XAUUSD (Gold)",

    date: trade.date.toISOString().slice(0, 10),

    entryAt: trade.entryAt.toISOString(),

    exitAt: trade.exitAt?.toISOString() ?? null,

    holdTimeMinutes: trade.holdTimeMinutes,

    type: fromTradeType(trade.type),

    netProfitLoss: num(trade.netProfitLoss) ?? 0,

    rMultiple: trade.rMultiple,

    entryPrice: num(trade.entryPrice) ?? 0,

    exitPrice: num(trade.exitPrice) ?? 0,

    mae: num(trade.mae),

    mfe: num(trade.mfe),

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

    noteContext: trade.noteContext,

    noteMistake: trade.noteMistake,

    noteNextAction: trade.noteNextAction,

  };

}



export async function getUserPlan(userId: string): Promise<Plan> {

  const user = await prisma.user.findUnique({

    where: { id: userId },

    select: { plan: true },

  });

  return user?.plan ?? Plan.FREE;

}



export async function countTradesForUser(userId: string): Promise<number> {

  return prisma.trade.count({ where: { userId } });

}



export async function getTradesForUser(userId: string): Promise<JournalTrade[]> {

  const trades = await prisma.trade.findMany({

    where: { userId },

    orderBy: { date: "desc" },

  });



  return trades.map(mapTrade);

}



function computeHoldMinutes(entryAt: Date, exitAt: Date | null | undefined, explicit: number | null | undefined) {

  if (explicit != null && explicit > 0) return explicit;

  if (!exitAt) return null;

  return Math.max(0, Math.round((exitAt.getTime() - entryAt.getTime()) / 60000));

}



export async function deleteTradeForUser(userId: string, tradeId: string): Promise<boolean> {
  const result = await prisma.trade.deleteMany({
    where: { id: tradeId, userId },
  });
  return result.count > 0;
}

export async function updateTradeForUser(
  userId: string,
  tradeId: string,
  trade: JournalTrade
): Promise<boolean> {
  const entryAt = new Date(trade.entryAt || trade.date);
  const exitAt = trade.exitAt ? new Date(trade.exitAt) : null;
  const holdTimeMinutes = computeHoldMinutes(entryAt, exitAt, trade.holdTimeMinutes);

  const result = await prisma.trade.updateMany({
    where: { id: tradeId, userId },
    data: {
      asset: trade.asset,
      date: new Date(trade.date),
      entryAt,
      exitAt,
      holdTimeMinutes,
      type: toTradeType(trade.type),
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
      noteContext: trade.noteContext.trim(),
      noteMistake: trade.noteMistake.trim(),
      noteNextAction: trade.noteNextAction.trim(),
    },
  });

  return result.count > 0;
}

export async function getTradeForUser(userId: string, tradeId: string): Promise<JournalTrade | null> {
  const trade = await prisma.trade.findFirst({
    where: { id: tradeId, userId },
  });
  return trade ? mapTrade(trade) : null;
}

export async function addTradeForUser(userId: string, trade: JournalTrade) {

  const entryAt = new Date(trade.entryAt || trade.date);

  const exitAt = trade.exitAt ? new Date(trade.exitAt) : null;

  const holdTimeMinutes = computeHoldMinutes(entryAt, exitAt, trade.holdTimeMinutes);



  await prisma.trade.create({

    data: {

      userId,

      asset: trade.asset,

      date: new Date(trade.date),

      entryAt,

      exitAt,

      holdTimeMinutes,

      type: toTradeType(trade.type),

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

      noteContext: trade.noteContext.trim(),

      noteMistake: trade.noteMistake.trim(),

      noteNextAction: trade.noteNextAction.trim(),

    },

  });

}


