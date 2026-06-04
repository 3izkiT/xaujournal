import { DisciplineChecklist, EmotionType, JournalTrade, SetupTag, TradeType } from "@/lib/types";

export const beforePlaceholder =
  "https://images.unsplash.com/photo-1642543348745-f0466dbf8348?auto=format&fit=crop&w=1200&q=80";
export const afterPlaceholder =
  "https://images.unsplash.com/photo-1642790551116-f2f5204f9ec6?auto=format&fit=crop&w=1200&q=80";

export const setupTagOptions: SetupTag[] = [
  "Liquidity Sweep",
  "FVG Mitigation",
  "Break of Structure",
  "Order Block",
];

export const emotionOptions: EmotionType[] = [
  "Calm",
  "Greed",
  "Fear",
  "FOMO",
  "Revenge Trading",
  "Overlot",
];

export { sessionOptions } from "@/lib/sessions";

export const tradeTypeOptions: TradeType[] = ["Buy", "Sell"];

/** Spot XAUUSD bounds for HTML validation — wide enough for current & future prices. */
export const XAU_SPOT_PRICE_MIN = 500;
export const XAU_SPOT_PRICE_MAX = 20_000;

export function calculateDisciplineScore(checklist: DisciplineChecklist): 0 | 33 | 66 | 100 {
  const yesCount = [checklist.followedPlan, checklist.rrAtLeastOneToTwo, checklist.calmMindset].filter(Boolean).length;
  if (yesCount === 3) return 100;
  if (yesCount === 2) return 66;
  if (yesCount === 1) return 33;
  return 0;
}

function mockTrade(
  trade: Omit<
    JournalTrade,
    "entryAt" | "exitAt" | "holdTimeMinutes" | "mae" | "mfe" | "noteContext" | "noteMistake" | "noteNextAction"
  > &
    Partial<Pick<JournalTrade, "entryAt" | "exitAt" | "holdTimeMinutes" | "mae" | "mfe" | "noteContext" | "noteMistake" | "noteNextAction">>
): JournalTrade {
  return {
    entryAt: `${trade.date}T13:00:00.000Z`,
    exitAt: null,
    holdTimeMinutes: 45,
    mae: -40,
    mfe: 90,
    noteContext: "Session aligned with plan.",
    noteMistake: "No major mistake.",
    noteNextAction: "Keep same risk per trade.",
    ...trade,
  };
}

export const mockTrades: JournalTrade[] = [
  mockTrade({
    id: "t-001",
    asset: "XAUUSD (Gold)",
    date: "2026-05-24",
    type: "Buy",
    netProfitLoss: 420,
    rMultiple: "+2.8R",
    entryPrice: 2335.4,
    exitPrice: 2344.8,
    session: "London Session",
    setupTags: ["Liquidity Sweep", "Break of Structure"],
    emotion: "Calm",
    beforeChartUrl: beforePlaceholder,
    afterChartUrl: afterPlaceholder,
    disciplineChecklist: { followedPlan: true, rrAtLeastOneToTwo: true, calmMindset: true },
    disciplineScore: 100,
    mae: -25,
    mfe: 140,
    holdTimeMinutes: 35,
    noteContext: "London sweep into BOS continuation.",
    noteMistake: "None.",
    noteNextAction: "Repeat London-only filter.",
  }),
  mockTrade({
    id: "t-002",
    asset: "XAUUSD (Gold)",
    date: "2026-05-25",
    type: "Sell",
    netProfitLoss: -180,
    rMultiple: "-1.0R",
    entryPrice: 2358.9,
    exitPrice: 2362.5,
    session: "New York Session",
    setupTags: ["Order Block"],
    emotion: "FOMO",
    beforeChartUrl: beforePlaceholder,
    afterChartUrl: afterPlaceholder,
    disciplineChecklist: { followedPlan: false, rrAtLeastOneToTwo: false, calmMindset: false },
    disciplineScore: 0,
    mae: -120,
    mfe: 30,
    holdTimeMinutes: 12,
    noteContext: "Chased NY open without confirmation.",
    noteMistake: "Entered before structure break.",
    noteNextAction: "Wait for 1:2 RR before entry.",
  }),
  mockTrade({
    id: "t-003",
    asset: "XAUUSD (Gold)",
    date: "2026-05-27",
    type: "Buy",
    netProfitLoss: 260,
    rMultiple: "+1.9R",
    entryPrice: 2320.1,
    exitPrice: 2328.3,
    session: "Tokyo Session",
    setupTags: ["FVG Mitigation", "Order Block"],
    emotion: "Calm",
    beforeChartUrl: beforePlaceholder,
    afterChartUrl: afterPlaceholder,
    disciplineChecklist: { followedPlan: true, rrAtLeastOneToTwo: true, calmMindset: false },
    disciplineScore: 66,
    entryAt: "2026-05-27T02:30:00.000Z",
    holdTimeMinutes: 90,
  }),
  mockTrade({
    id: "t-004",
    asset: "XAUUSD (Gold)",
    date: "2026-05-28",
    type: "Sell",
    netProfitLoss: 90,
    rMultiple: "+0.7R",
    entryPrice: 2346.6,
    exitPrice: 2344.9,
    session: "London Session",
    setupTags: ["Liquidity Sweep"],
    emotion: "Fear",
    beforeChartUrl: beforePlaceholder,
    afterChartUrl: afterPlaceholder,
    disciplineChecklist: { followedPlan: true, rrAtLeastOneToTwo: false, calmMindset: true },
    disciplineScore: 66,
    mae: -55,
    mfe: 45,
  }),
  mockTrade({
    id: "t-005",
    asset: "XAUUSD (Gold)",
    date: "2026-05-30",
    type: "Buy",
    netProfitLoss: -95,
    rMultiple: "-0.6R",
    entryPrice: 2369.4,
    exitPrice: 2366.7,
    session: "New York Session",
    setupTags: ["Break of Structure"],
    emotion: "Revenge Trading",
    beforeChartUrl: beforePlaceholder,
    afterChartUrl: afterPlaceholder,
    disciplineChecklist: { followedPlan: false, rrAtLeastOneToTwo: true, calmMindset: false },
    disciplineScore: 33,
    noteMistake: "Revenge entry after prior loss.",
    noteNextAction: "Stop after 1 loss per session.",
  }),
  mockTrade({
    id: "t-006",
    asset: "XAUUSD (Gold)",
    date: "2026-06-01",
    type: "Buy",
    netProfitLoss: 350,
    rMultiple: "+2.3R",
    entryPrice: 2388.2,
    exitPrice: 2395.6,
    session: "New York Session",
    setupTags: ["FVG Mitigation", "Break of Structure"],
    emotion: "Calm",
    beforeChartUrl: beforePlaceholder,
    afterChartUrl: afterPlaceholder,
    disciplineChecklist: { followedPlan: true, rrAtLeastOneToTwo: true, calmMindset: true },
    disciplineScore: 100,
    holdTimeMinutes: 75,
    mae: -30,
    mfe: 160,
  }),
];
