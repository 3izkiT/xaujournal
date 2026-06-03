"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useXauJournal } from "@/components/XauJournalContext";
import {
  getAverageHoldTimeMinutes,
  getAverageMaeMfe,
  getDayHourHeatmap,
  getSessionPerformance,
  getSetupWinRateVsMistakes,
} from "@/lib/analytics";
import { getRuleBreakStats } from "@/lib/discipline";

const SetupAnalytics = dynamic(
  () => import("@/components/dashboard/SetupAnalytics").then((m) => m.SetupAnalytics),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-2xl bg-xau-card" /> }
);

const ExecutionAnalytics = dynamic(
  () => import("@/components/dashboard/ExecutionAnalytics").then((m) => m.ExecutionAnalytics),
  { ssr: false, loading: () => <div className="h-48 animate-pulse rounded-2xl bg-xau-card" /> }
);

const DisciplineAnalytics = dynamic(
  () => import("@/components/dashboard/DisciplineAnalytics").then((m) => m.DisciplineAnalytics),
  { ssr: false, loading: () => <div className="h-48 animate-pulse rounded-2xl bg-xau-card" /> }
);

export default function AnalyticsPage() {
  const { trades, loading } = useXauJournal();
  const setupVsMistakes = getSetupWinRateVsMistakes(trades);
  const sessionData = getSessionPerformance(trades);
  const ruleBreaks = getRuleBreakStats(trades).map((r) => ({ label: r.label, count: r.count }));
  const heatmap = getDayHourHeatmap(trades);
  const avgHoldMinutes = getAverageHoldTimeMinutes(trades);
  const { avgMae, avgMfe } = getAverageMaeMfe(trades);
  const tradeCount = trades.length;

  if (loading) {
    return <p className="text-sm text-xau-muted">Loading analytics…</p>;
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-xau-gold-accent">Deep dive</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Analytics</h1>
        <p className="mt-1 text-sm text-xau-muted">
          For traders who log on purpose — {tradeCount} intentional XAUUSD trade{tradeCount === 1 ? "" : "s"} so far.
        </p>
      </header>

      {tradeCount === 0 ? (
        <div className="xau-card-bordered px-6 py-12 text-center">
          <p className="text-sm text-xau-muted">Log trades to unlock the full analytics suite.</p>
          <Link href="/journal-entry" className="xau-btn-gold mt-4 inline-block">
            Log first trade
          </Link>
        </div>
      ) : (
        <>
          <SetupAnalytics setupVsMistakes={setupVsMistakes} />
          <ExecutionAnalytics
            sessionData={sessionData}
            avgHoldMinutes={avgHoldMinutes}
            avgMae={avgMae}
            avgMfe={avgMfe}
          />
          <DisciplineAnalytics ruleBreaks={ruleBreaks} heatmap={heatmap} />
        </>
      )}
    </div>
  );
}
