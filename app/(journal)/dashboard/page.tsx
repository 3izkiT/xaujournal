"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect } from "react";
import { DashboardMetricsHero } from "@/components/dashboard/DashboardMetricsHero";
import { DashboardSectionNav } from "@/components/dashboard/DashboardSectionNav";
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
    <div className="xau-page-dashboard">
      <header className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-xau-gold-accent">
              XAUUSD · Discipline journal
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-xau-ink md:text-[1.85rem]">
              {tradeCount === 0 ? "Welcome back" : "Trading dashboard"}
            </h1>
            <p className="mt-1 max-w-xl text-sm text-xau-muted">
              {tradeCount === 0
                ? "Log your first trade to see P&L, calendar, and analytics in one workspace."
                : `${tradeCount} intentional trade${tradeCount === 1 ? "" : "s"} — review performance, then drill into analytics.`}
            </p>
          </div>
          <Link href="/journal-entry" className="xau-btn-gold shrink-0 px-5 py-2.5">
            + Log trade
          </Link>
        </div>
        <DashboardSectionNav />
      </header>

      <DashboardMetricsHero
        winRate={winRate}
        avgDiscipline={avgDiscipline}
        monthlyDiscipline={monthlyDiscipline}
        totalPnl={totalPnl}
        profitFactor={profitFactor}
      />

      <section id="overview" className="scroll-mt-28 grid gap-5 lg:grid-cols-12 lg:items-start lg:gap-6">
        <div className="order-1 lg:col-span-8">
          <EquityChart equityCurve={equityCurve} />
        </div>

        <aside className="order-2 flex flex-col gap-5 lg:sticky lg:top-24 lg:col-span-4 lg:row-span-2 lg:self-start">
          <TradeCalendarPanel trades={trades} variant="sidebar" />
          <SessionMini sessionData={sessionData} />
        </aside>

        <div className="order-3 lg:col-span-8">
          <RecentTradesPanel trades={trades} />
        </div>
      </section>

      <section id="analytics" className="scroll-mt-28">
        <div className="xau-card-bordered space-y-6 p-5 md:p-6 lg:p-8">
          <div className="border-b border-xau-border pb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-xau-gold-accent">Deep dive</p>
            <h2 className="mt-1 text-xl font-semibold text-xau-ink md:text-2xl">Advanced analytics</h2>
            <p className="mt-1 text-sm text-xau-muted">
              Setup quality, execution stats, and discipline patterns — same data pro journals surface after the headline KPIs.
            </p>
          </div>

          {tradeCount === 0 ? (
            <div className="rounded-2xl bg-xau-app px-6 py-12 text-center">
              <p className="text-sm text-xau-muted">Log trades to unlock setup, MAE/MFE, and heatmap analytics.</p>
              <Link href="/journal-entry" className="xau-btn-gold mt-4 inline-block">
                Log first trade
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <SetupAnalytics setupVsMistakes={setupVsMistakes} />
              <ExecutionAnalytics
                sessionData={sessionData}
                avgHoldMinutes={avgHoldMinutes}
                avgMae={avgMae}
                avgMfe={avgMfe}
              />
              <DisciplineAnalytics ruleBreaks={ruleBreaks} heatmap={heatmap} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
