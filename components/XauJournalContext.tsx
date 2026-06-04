"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { LEGACY_TRADES_KEY_PREFIX, tradesStorageKey } from "@/lib/brand";
import { calculateDisciplineScore, setupTagOptions as defaultSetupTags } from "@/lib/data";
import { FREE_TRADE_LIMIT } from "@/lib/plans";
import { normalizeSessionLabel } from "@/lib/sessions";
import {
  DisciplineChecklist,
  EmotionType,
  JournalTrade,
  SessionType,
  SetupTag,
  TradeType,
  UserPlan,
} from "@/lib/types";
import { DEFAULT_CHECKLIST } from "@/lib/user-settings";
import { mergeSetupTagOptions, type UserSettingsPayload } from "@/lib/user-settings-types";

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
  settingsLoading: boolean;
  settings: UserSettingsPayload;
  setupTagOptions: string[];
  plan: UserPlan;
  tradeLimit: number | null;
  tradeCount: number;
  canAddMore: boolean;
  addTrade: (payload: AddTradePayload) => Promise<{ ok: boolean; error?: string }>;
  updateTrade: (tradeId: string, payload: AddTradePayload) => Promise<{ ok: boolean; error?: string }>;
  removeTrade: (tradeId: string) => Promise<{ ok: boolean; error?: string }>;
  refreshTrades: (options?: { silent?: boolean }) => Promise<void>;
  refreshSettings: () => Promise<void>;
};

const defaultSettings: UserSettingsPayload = {
  customChecklist: DEFAULT_CHECKLIST,
  customSetupTags: [...defaultSetupTags],
  customErrorTags: [],
  riskModel: "FIXED_PERCENT",
  templatePreset: "INTRADAY",
};

const XauJournalContext = createContext<XauJournalContextValue | null>(null);

function withNormalizedSessions(trades: JournalTrade[]): JournalTrade[] {
  return trades.map((trade) => ({
    ...trade,
    session: normalizeSessionLabel(trade.session),
  }));
}

export function XauJournalProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [trades, setTrades] = useState<JournalTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settings, setSettings] = useState<UserSettingsPayload>(defaultSettings);
  const [plan, setPlan] = useState<UserPlan>("FREE");
  const [tradeLimit, setTradeLimit] = useState<number | null>(FREE_TRADE_LIMIT);
  const [tradeCount, setTradeCount] = useState(0);
  const [canAddMore, setCanAddMore] = useState(true);

  const storageKey = user?.id ? tradesStorageKey(user.id) : null;

  const setupTagOptions = useMemo(
    () => mergeSetupTagOptions(defaultSetupTags, settings.customSetupTags),
    [settings.customSetupTags]
  );

  const readCachedTrades = useCallback((userId: string): JournalTrade[] | null => {
    if (typeof window === "undefined") return null;
    const key = tradesStorageKey(userId);
    const legacyKey = `${LEGACY_TRADES_KEY_PREFIX}${userId}`;
    const raw = localStorage.getItem(key) ?? localStorage.getItem(legacyKey);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as JournalTrade[];
      const normalized = withNormalizedSessions(parsed);
      if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(normalized));
      return normalized;
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

  const refreshSettings = useCallback(async () => {
    if (!user?.id) {
      setSettings(defaultSettings);
      setSettingsLoading(false);
      return;
    }

    setSettingsLoading(true);
    try {
      const res = await fetch("/api/settings", { credentials: "include", cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { settings: UserSettingsPayload };
        setSettings(data.settings);
      }
    } catch {
      // keep previous settings
    } finally {
      setSettingsLoading(false);
    }
  }, [user?.id]);

  const refreshTrades = useCallback(async (options?: { silent?: boolean }) => {
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
        setTrades(withNormalizedSessions(data.trades));
        applyMeta(data);
        if (storageKey) localStorage.setItem(storageKey, JSON.stringify(withNormalizedSessions(data.trades)));
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
    if (!user?.id) {
      setTrades([]);
      setLoading(false);
      void refreshSettings();
      return;
    }
    const cached = readCachedTrades(user.id);
    if (cached?.length) {
      setTrades(cached);
      setLoading(false);
      void refreshTrades({ silent: true });
    } else {
      void refreshTrades();
    }
    void refreshSettings();
  }, [authReady, user?.id, refreshTrades, refreshSettings, readCachedTrades]);

  const addTrade = useCallback(
    async (payload: AddTradePayload): Promise<{ ok: boolean; error?: string }> => {
      if (!user?.id) return { ok: false, error: "Not signed in." };
      if (!canAddMore) {
        return {
          ok: false,
          error: `Trade log limit reached (${FREE_TRADE_LIMIT} on free tier).`,
        };
      }

      const disciplineScore = calculateDisciplineScore(payload.disciplineChecklist);
      const entryAt = payload.entryAt ?? new Date(`${payload.date}T12:00:00`).toISOString();
      const optimisticId = `t-${Date.now()}`;
      const optimistic: JournalTrade = {
        ...payload,
        id: optimisticId,
        asset: "XAUUSD (Gold)",
        disciplineScore,
        entryAt,
        exitAt: payload.exitAt ?? null,
        holdTimeMinutes: payload.holdTimeMinutes ?? null,
        mae: payload.mae ?? null,
        mfe: payload.mfe ?? null,
      };

      const rollbackOptimistic = () => {
        setTrades((prev) => {
          const next = prev.filter((t) => t.id !== optimisticId);
          if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next));
          return next;
        });
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
          setTrades(withNormalizedSessions(data.trades));
          applyMeta(data);
          if (storageKey) localStorage.setItem(storageKey, JSON.stringify(withNormalizedSessions(data.trades)));
          return { ok: true };
        }
        rollbackOptimistic();
        if (data.trades) setTrades(withNormalizedSessions(data.trades));
        applyMeta(data);
        return { ok: false, error: data.error ?? "Failed to save trade." };
      } catch {
        rollbackOptimistic();
        return { ok: false, error: "Network error. Check your connection and try again." };
      }
    },
    [user?.id, canAddMore, storageKey, applyMeta]
  );

  const updateTrade = useCallback(
    async (tradeId: string, payload: AddTradePayload): Promise<{ ok: boolean; error?: string }> => {
      if (!user?.id) return { ok: false, error: "Not signed in." };

      try {
        const res = await fetch(`/api/trades/${encodeURIComponent(tradeId)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
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
          setTrades(withNormalizedSessions(data.trades));
          applyMeta(data);
          if (storageKey) localStorage.setItem(storageKey, JSON.stringify(withNormalizedSessions(data.trades)));
          return { ok: true };
        }
        return { ok: false, error: data.error ?? "Failed to update trade." };
      } catch {
        return { ok: false, error: "Network error." };
      }
    },
    [user?.id, storageKey, applyMeta]
  );

  const removeTrade = useCallback(
    async (tradeId: string): Promise<{ ok: boolean; error?: string }> => {
      if (!user?.id) return { ok: false, error: "Not signed in." };

      try {
        const res = await fetch(`/api/trades/${encodeURIComponent(tradeId)}`, {
          method: "DELETE",
          credentials: "include",
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
          setTrades(withNormalizedSessions(data.trades));
          applyMeta(data);
          if (storageKey) localStorage.setItem(storageKey, JSON.stringify(withNormalizedSessions(data.trades)));
          return { ok: true };
        }
        return { ok: false, error: data.error ?? "Failed to delete trade." };
      } catch {
        return { ok: false, error: "Network error." };
      }
    },
    [user?.id, storageKey, applyMeta]
  );

  const value = useMemo(
    () => ({
      trades,
      loading,
      settingsLoading,
      settings,
      setupTagOptions,
      plan,
      tradeLimit,
      tradeCount,
      canAddMore,
      addTrade,
      updateTrade,
      removeTrade,
      refreshTrades,
      refreshSettings,
    }),
    [
      trades,
      loading,
      settingsLoading,
      settings,
      setupTagOptions,
      plan,
      tradeLimit,
      tradeCount,
      canAddMore,
      addTrade,
      updateTrade,
      removeTrade,
      refreshTrades,
      refreshSettings,
    ]
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
