"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect } from "react";
import { DashboardSectionNav } from "@/components/dashboard/DashboardSectionNav";
import { HelpTooltip, PanelHeading } from "@/components/ui/HelpTooltip";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { RecentTradesPanel } from "@/components/dashboard/RecentTradesPanel";
import { TradeCalendarPanel } from "@/components/dashboard/TradeCalendarPanel";
import { useXauJournal } from "@/components/XauJournalContext";
import {
  getAverageDisciplineScore,
  getAverageHoldTimeMinutes,
  getAverageMaeMfe,
  getDayHourHeatmap,
  getEquityCurve,
  getMonthlyDisciplineScore,
  getProfitFactor,
  getSessionPerformance,
  getSetupWinRateVsMistakes,
  getTotalPnl,
  getWinRate,
} from "@/lib/analytics";
import { getRuleBreakStats } from "@/lib/discipline";

const EquityChart = dynamic(
  () => import("@/components/dashboard/EquityChart").then((m) => m.EquityChart),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-2xl bg-xau-card" /> }
);

const SessionMini = dynamic(
  () => import("@/components/dashboard/SessionMini").then((m) => m.SessionMini),
  { ssr: false, loading: () => <div className="h-40 animate-pulse rounded-2xl bg-xau-card" /> }
);

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

export default function DashboardPage() {
  const { trades, loading } = useXauJournal();
  const winRate = getWinRate(trades);
  const avgDiscipline = getAverageDisciplineScore(trades);
  const monthlyDiscipline = getMonthlyDisciplineScore(trades);
  const totalPnl = getTotalPnl(trades);
  const profitFactor = getProfitFactor(trades);
  const equityCurve = getEquityCurve(trades);
  const sessionData = getSessionPerformance(trades);
  const setupVsMistakes = getSetupWinRateVsMistakes(trades);
  const ruleBreaks = getRuleBreakStats(trades).map((r) => ({ label: r.label, count: r.count }));
  const heatmap = getDayHourHeatmap(trades);
  const avgHoldMinutes = getAverageHoldTimeMinutes(trades);
  const { avgMae, avgMfe } = getAverageMaeMfe(trades);
  const tradeCount = trades.length;

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const el = document.getElementById(hash);
    if (!el) return;
    const timer = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return <p className="text-sm text-xau-muted">Loading your journal…</p>;
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <header id="overview" className="scroll-mt-24 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="inline-flex flex-wrap items-center gap-2 text-2xl font-semibold tracking-tight text-xau-ink md:text-[1.75rem]">
              {tradeCount === 0 ? "Welcome back" : "Performance overview"}
              {tradeCount > 0 ? (
                <HelpTooltip term="performanceOverview" label="About performance overview" placement="above" />
              ) : null}
            </h1>
            <p className="mt-1 text-sm text-xau-muted">
              {tradeCount === 0
                ? "Log your first XAUUSD trade to unlock your terminal."
                : `${tradeCount} trade${tradeCount === 1 ? "" : "s"} · KPIs, calendar, and analytics in one place`}
            </p>
          </div>
          <Link href="/journal-entry" className="xau-btn-gold shrink-0">
            Log trade
          </Link>
        </div>
        <DashboardSectionNav />
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Win rate" value={`${winRate}%`} accent="profit" tooltipTerm="winRate" />
        <KpiCard label="Discipline" value={`${avgDiscipline}%`} hint={`Month: ${monthlyDiscipline}%`} accent="calm" tooltipTerm="discipline" />
        <KpiCard
          label="Net P&L"
          value={`${totalPnl >= 0 ? "+" : "-"}$${Math.abs(totalPnl).toFixed(2)}`}
          accent={totalPnl >= 0 ? "profit" : "loss"}
          valueClassName={totalPnl >= 0 ? "text-tv-profit" : "text-tv-loss"}
          tooltipTerm="netPnl"
        />
        <KpiCard label="Profit factor" value={String(profitFactor)} accent="gold" tooltipTerm="profitFactor" />
      </div>

      <EquityChart equityCurve={equityCurve} />

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RecentTradesPanel trades={trades} />
        </div>
        <div className="lg:col-span-2">
          <SessionMini sessionData={sessionData} />
        </div>
      </div>

      <TradeCalendarPanel trades={trades} />

      <section id="analytics" className="scroll-mt-24 space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-xau-gold-accent">Deep dive</p>
          <PanelHeading
            as="h2"
            className="mt-1"
            title="Analytics"
            term="analytics"
            description="Setup quality, execution, and discipline patterns from intentional logs."
          />
        </div>

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
      </section>
    </div>
  );
}
