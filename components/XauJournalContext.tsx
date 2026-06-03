"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { LEGACY_TRADES_KEY_PREFIX, tradesStorageKey } from "@/lib/brand";
import { calculateDisciplineScore } from "@/lib/data";
import { FREE_TRADE_LIMIT } from "@/lib/plans";
import {
  DisciplineChecklist,
  EmotionType,
  JournalTrade,
  SessionType,
  SetupTag,
  TradeType,
  UserPlan,
} from "@/lib/types";

type AppUser = {
  id: string;
  email: string;
  name: string;
  plan: UserPlan;
};

type AddTradePayload = {
  date: string;
  entryAt?: string;
  exitAt?: string | null;
  holdTimeMinutes?: number | null;
  type: TradeType;
  netProfitLoss: number;
  rMultiple: string;
  entryPrice: number;
  exitPrice: number;
  mae?: number | null;
  mfe?: number | null;
  session: SessionType;
  setupTags: SetupTag[];
  emotion: EmotionType;
  beforeChartUrl: string;
  afterChartUrl: string;
  disciplineChecklist: DisciplineChecklist;
  noteContext: string;
  noteMistake: string;
  noteNextAction: string;
};

type XauJournalContextValue = {
  trades: JournalTrade[];
  loading: boolean;
  plan: UserPlan;
  tradeLimit: number | null;
  tradeCount: number;
  canAddMore: boolean;
  addTrade: (payload: AddTradePayload) => Promise<{ ok: boolean; error?: string }>;
  refreshTrades: () => Promise<void>;
};

const XauJournalContext = createContext<XauJournalContextValue | null>(null);

export function XauJournalProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [trades, setTrades] = useState<JournalTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<UserPlan>("FREE");
  const [tradeLimit, setTradeLimit] = useState<number | null>(FREE_TRADE_LIMIT);
  const [tradeCount, setTradeCount] = useState(0);
  const [canAddMore, setCanAddMore] = useState(true);

  const storageKey = user?.id ? tradesStorageKey(user.id) : null;

  const readCachedTrades = useCallback((userId: string): JournalTrade[] | null => {
    if (typeof window === "undefined") return null;
    const key = tradesStorageKey(userId);
    const legacyKey = `${LEGACY_TRADES_KEY_PREFIX}${userId}`;
    const raw = localStorage.getItem(key) ?? localStorage.getItem(legacyKey);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as JournalTrade[];
      if (!localStorage.getItem(key)) localStorage.setItem(key, raw);
      return parsed;
    } catch {
      return null;
    }
  }, []);

  const applyMeta = useCallback(
    (data: { plan?: UserPlan; tradeLimit?: number | null; tradeCount?: number; canAddMore?: boolean }) => {
      if (data.plan) setPlan(data.plan);
      if (data.tradeLimit !== undefined) setTradeLimit(data.tradeLimit);
      if (data.tradeCount !== undefined) setTradeCount(data.tradeCount);
      if (data.canAddMore !== undefined) setCanAddMore(data.canAddMore);
    },
    []
  );

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include", cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as { user: AppUser };
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setAuthReady(true);
      }
    })();
  }, []);

  const refreshTrades = useCallback(async () => {
    if (!user?.id) {
      setTrades([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/trades", { cache: "no-store", credentials: "include" });
      if (res.ok) {
        const data = (await res.json()) as {
          trades: JournalTrade[];
          plan?: UserPlan;
          tradeLimit?: number | null;
          tradeCount?: number;
          canAddMore?: boolean;
        };
        setTrades(data.trades);
        applyMeta(data);
        if (storageKey) localStorage.setItem(storageKey, JSON.stringify(data.trades));
      } else if (user?.id) {
        const cached = readCachedTrades(user.id);
        if (cached) setTrades(cached);
        setPlan(user.plan ?? "FREE");
      }
    } catch {
      if (user?.id) {
        const cached = readCachedTrades(user.id);
        if (cached) setTrades(cached);
      }
      setPlan(user.plan ?? "FREE");
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.plan, storageKey, applyMeta, readCachedTrades]);

  useEffect(() => {
    if (!authReady) return;
    void refreshTrades();
  }, [authReady, refreshTrades]);

  const addTrade = useCallback(
    async (payload: AddTradePayload): Promise<{ ok: boolean; error?: string }> => {
      if (!user?.id) return { ok: false, error: "Not signed in." };
      if (!canAddMore) {
        return {
          ok: false,
          error: `Free tier limit (${FREE_TRADE_LIMIT} logs). Upgrade for unlimited.`,
        };
      }

      const disciplineScore = calculateDisciplineScore(payload.disciplineChecklist);
      const entryAt = payload.entryAt ?? new Date(`${payload.date}T12:00:00`).toISOString();
      const optimistic: JournalTrade = {
        ...payload,
        id: `t-${Date.now()}`,
        asset: "XAUUSD (Gold)",
        disciplineScore,
        entryAt,
        exitAt: payload.exitAt ?? null,
        holdTimeMinutes: payload.holdTimeMinutes ?? null,
        mae: payload.mae ?? null,
        mfe: payload.mfe ?? null,
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
          credentials: "include",
          body: JSON.stringify({ ...payload, entryAt }),
        });
        const data = (await res.json()) as {
          trades?: JournalTrade[];
          error?: string;
          plan?: UserPlan;
          tradeLimit?: number | null;
          tradeCount?: number;
          canAddMore?: boolean;
        };
        if (res.ok && data.trades) {
          setTrades(data.trades);
          applyMeta(data);
          if (storageKey) localStorage.setItem(storageKey, JSON.stringify(data.trades));
          return { ok: true };
        }
        if (data.trades) setTrades(data.trades);
        applyMeta(data);
        return { ok: false, error: data.error ?? "Failed to save trade." };
      } catch {
        return { ok: false, error: "Network error." };
      }
    },
    [user?.id, canAddMore, storageKey, applyMeta]
  );

  const value = useMemo(
    () => ({
      trades,
      loading,
      plan,
      tradeLimit,
      tradeCount,
      canAddMore,
      addTrade,
      refreshTrades,
    }),
    [trades, loading, plan, tradeLimit, tradeCount, canAddMore, addTrade, refreshTrades]
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
