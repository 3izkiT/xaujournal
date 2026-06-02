"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { calculateDisciplineScore, mockTrades } from "@/lib/data";
import { DisciplineChecklist, EmotionType, JournalTrade, SessionType, SetupTag, TradeType } from "@/lib/types";

type AddTradePayload = {
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
};

type XauJournalContextValue = {
  trades: JournalTrade[];
  addTrade: (payload: AddTradePayload) => void;
};

const XauJournalContext = createContext<XauJournalContextValue | null>(null);

export function XauJournalProvider({ children }: { children: ReactNode }) {
  const [trades, setTrades] = useState<JournalTrade[]>(mockTrades);

  const addTrade = (payload: AddTradePayload) => {
    const disciplineScore = calculateDisciplineScore(payload.disciplineChecklist);
    const newTrade: JournalTrade = {
      id: `t-${Date.now()}`,
      asset: "XAUUSD (Gold)",
      disciplineScore,
      ...payload,
    };

    setTrades((prev) => [newTrade, ...prev]);
  };

  const value = useMemo(() => ({ trades, addTrade }), [trades]);
  return <XauJournalContext.Provider value={value}>{children}</XauJournalContext.Provider>;
}

export function useXauJournal() {
  const ctx = useContext(XauJournalContext);
  if (!ctx) {
    throw new Error("useXauJournal must be used inside XauJournalProvider");
  }
  return ctx;
}
