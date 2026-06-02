"use client";

import { useSession } from "next-auth/react";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { calculateDisciplineScore } from "@/lib/data";
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
  loading: boolean;
  addTrade: (payload: AddTradePayload) => Promise<void>;
  refreshTrades: () => Promise<void>;
};

const XauJournalContext = createContext<XauJournalContextValue | null>(null);

export function XauJournalProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [trades, setTrades] = useState<JournalTrade[]>([]);
  const [loading, setLoading] = useState(true);

  const storageKey = session?.user?.id ? `xaujournal-trades-${session.user.id}` : null;

  const refreshTrades = useCallback(async () => {
    if (!session?.user?.id) {
      setTrades([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/trades", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { trades: JournalTrade[] };
        setTrades(data.trades);
        if (storageKey) localStorage.setItem(storageKey, JSON.stringify(data.trades));
      } else if (storageKey) {
        const cached = localStorage.getItem(storageKey);
        if (cached) setTrades(JSON.parse(cached) as JournalTrade[]);
      }
    } catch {
      if (storageKey) {
        const cached = localStorage.getItem(storageKey);
        if (cached) setTrades(JSON.parse(cached) as JournalTrade[]);
      }
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, storageKey]);

  useEffect(() => {
    if (status === "loading") return;
    void refreshTrades();
  }, [status, refreshTrades]);

  const addTrade = async (payload: AddTradePayload) => {
    if (!session?.user?.id) return;

    const disciplineScore = calculateDisciplineScore(payload.disciplineChecklist);
    const optimistic: JournalTrade = {
      id: `t-${Date.now()}`,
      asset: "XAUUSD (Gold)",
      disciplineScore,
      ...payload,
    };

    setTrades((prev) => {
      const next = [optimistic, ...prev];
      if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });

    try {
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = (await res.json()) as { trades: JournalTrade[] };
        setTrades(data.trades);
        if (storageKey) localStorage.setItem(storageKey, JSON.stringify(data.trades));
      }
    } catch {
      // optimistic update kept
    }
  };

  const value = useMemo(
    () => ({ trades, loading, addTrade, refreshTrades }),
    [trades, loading, refreshTrades, addTrade]
  );

  return <XauJournalContext.Provider value={value}>{children}</XauJournalContext.Provider>;
}

export function useXauJournal() {
  const ctx = useContext(XauJournalContext);
  if (!ctx) {
    throw new Error("useXauJournal must be used inside XauJournalProvider");
  }
  return ctx;
}
