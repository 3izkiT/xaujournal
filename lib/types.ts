export type TradeType = "Buy" | "Sell";
export type SessionType = "London Session" | "New York Session" | "Asian Session";
export type EmotionType =
  | "Calm"
  | "Greed"
  | "Fear"
  | "FOMO"
  | "Revenge Trading"
  | "Overlot";

export type SetupTag =
  | "Liquidity Sweep"
  | "FVG Mitigation"
  | "Break of Structure"
  | "Order Block";

export type DisciplineChecklist = {
  followedPlan: boolean;
  rrAtLeastOneToTwo: boolean;
  calmMindset: boolean;
};

export type JournalTrade = {
  id: string;
  asset: "XAUUSD (Gold)";
  date: string;
  type: TradeType;
  netProfitLoss: number;
  rMultiple: string;
  entryPrice: number;
  exitPrice: number;
  session: SessionType;
  setupTags: SetupTag[];
  emotion: EmotionType;
  beforeChartUrl: string;
  afterChartUrl: string;
  disciplineChecklist: DisciplineChecklist;
  disciplineScore: 0 | 33 | 66 | 100;
};
