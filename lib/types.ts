export type TradeType = "Buy" | "Sell";
export type SessionType = "London Session" | "New York Session" | "Asian Session";
export type EmotionType =
  | "Calm"
  | "Greed"
  | "Fear"
  | "FOMO"
  | "Revenge Trading"
  | "Overlot";

export type SetupTag = string;

export type DisciplineChecklist = {
  followedPlan: boolean;
  rrAtLeastOneToTwo: boolean;
  calmMindset: boolean;
};

export type TradeNotes = {
  noteContext: string;
  noteMistake: string;
  noteNextAction: string;
};

export type JournalTrade = {
  id: string;
  asset: "XAUUSD (Gold)";
  date: string;
  entryAt: string;
  exitAt: string | null;
  holdTimeMinutes: number | null;
  type: TradeType;
  netProfitLoss: number;
  rMultiple: string;
  entryPrice: number;
  exitPrice: number;
  mae: number | null;
  mfe: number | null;
  session: SessionType;
  setupTags: SetupTag[];
  emotion: EmotionType;
  beforeChartUrl: string;
  afterChartUrl: string;
  disciplineChecklist: DisciplineChecklist;
  disciplineScore: 0 | 33 | 66 | 100;
  noteContext: string;
  noteMistake: string;
  noteNextAction: string;
};

export type UserPlan = "FREE" | "PREMIUM_GOLD";
