"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DashboardMetricsHero } from "@/components/dashboard/DashboardMetricsHero";
import {
  DashboardOverviewChartsSkeleton,
} from "@/components/dashboard/DashboardOverviewCharts";
import {
  DashboardSectionNav,
  type DashboardTab,
  isDashboardTab,
} from "@/components/dashboard/DashboardSectionNav";
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

const DashboardOverviewCharts = dynamic(
  () =>
    import("@/components/dashboard/DashboardOverviewCharts").then((m) => m.DashboardOverviewCharts),
  { ssr: false, loading: () => <DashboardOverviewChartsSkeleton /> }
);

const DashboardAnalyticsPanels = dynamic(
  () =>
    import("@/components/dashboard/DashboardAnalyticsPanels").then((m) => m.DashboardAnalyticsPanels),
  { ssr: false, loading: () => <div className="h-96 animate-pulse rounded-2xl bg-xau-card" aria-hidden /> }
);

function tabFromHash(): DashboardTab {
  if (typeof window === "undefined") return "overview";
  const hash = window.location.hash.replace("#", "");
  return isDashboardTab(hash) ? hash : "overview";
}

function hashForTab(tab: DashboardTab): string {
  return tab === "overview" ? "" : `#${tab}`;
}

function DashboardSkeleton() {
  return (
    <div className="xau-page-dashboard" aria-busy="true" aria-label="Loading dashboard">
      <div className="h-24 animate-pulse rounded-2xl bg-xau-card" />
      <div className="h-28 animate-pulse rounded-2xl bg-xau-card" />
      <div className="grid gap-5 lg:grid-cols-12">
        <div className="h-64 animate-pulse rounded-2xl bg-xau-card md:h-80 lg:col-span-8" />
        <div className="h-64 animate-pulse rounded-2xl bg-xau-card md:h-80 lg:col-span-4" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { trades, loading } = useXauJournal();
  const [activeTab, setActiveTab] = useState<DashboardTab>(() => tabFromHash());

  const headline = useMemo(
    () => ({
      winRate: getWinRate(trades),
      avgDiscipline: getAverageDisciplineScore(trades),
      monthlyDiscipline: getMonthlyDisciplineScore(trades),
      totalPnl: getTotalPnl(trades),
      profitFactor: getProfitFactor(trades),
    }),
    [trades]
  );

  const equityCurve = useMemo(() => getEquityCurve(trades), [trades]);
  const sessionData = useMemo(() => getSessionPerformance(trades), [trades]);
  const tradeCount = trades.length;

  const analyticsData = useMemo(() => {
    if (activeTab !== "analytics") return null;
    const { avgMae, avgMfe } = getAverageMaeMfe(trades);
    return {
      setupVsMistakes: getSetupWinRateVsMistakes(trades),
      ruleBreaks: getRuleBreakStats(trades).map((r) => ({ label: r.label, count: r.count })),
      heatmap: getDayHourHeatmap(trades),
      avgHoldMinutes: getAverageHoldTimeMinutes(trades),
      avgMae,
      avgMfe,
    };
  }, [trades, activeTab]);

  const setTab = useCallback((tab: DashboardTab) => {
    setActiveTab(tab);
    const path = `/dashboard${hashForTab(tab)}`;
    window.history.replaceState(null, "", path);
  }, []);

  useEffect(() => {
    setActiveTab(tabFromHash());
    const onHashChange = () => setActiveTab(tabFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
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
                : `${tradeCount} intentional trade${tradeCount === 1 ? "" : "s"} — switch tabs to review performance, calendar, and analytics.`}
            </p>
          </div>
          <Link href="/journal-entry" className="xau-btn-gold shrink-0 px-5 py-2.5">
            + Log trade
          </Link>
        </div>
        <DashboardSectionNav active={activeTab} onChange={setTab} />
      </header>

      <DashboardMetricsHero
        winRate={headline.winRate}
        avgDiscipline={headline.avgDiscipline}
        monthlyDiscipline={headline.monthlyDiscipline}
        totalPnl={headline.totalPnl}
        profitFactor={headline.profitFactor}
      />

      {activeTab === "overview" && (
        <section
          id="dashboard-panel-overview"
          role="tabpanel"
          aria-labelledby="dashboard-tab-overview"
          className="animate-rise-up grid gap-5 lg:grid-cols-12 lg:items-stretch lg:gap-6"
        >
          <DashboardOverviewCharts equityCurve={equityCurve} sessionData={sessionData} />
          <div className="lg:col-span-12">
            <RecentTradesPanel trades={trades} />
          </div>
        </section>
      )}

      {activeTab === "calendar" && (
        <section
          id="dashboard-panel-calendar"
          role="tabpanel"
          aria-labelledby="dashboard-tab-calendar"
          className="animate-rise-up"
        >
          <TradeCalendarPanel trades={trades} />
        </section>
      )}

      {activeTab === "analytics" && (
        <section
          id="dashboard-panel-analytics"
          role="tabpanel"
          aria-labelledby="dashboard-tab-analytics"
          className="animate-rise-up"
        >
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
            ) : analyticsData ? (
              <DashboardAnalyticsPanels
                setupVsMistakes={analyticsData.setupVsMistakes}
                sessionData={sessionData}
                avgHoldMinutes={analyticsData.avgHoldMinutes}
                avgMae={analyticsData.avgMae}
                avgMfe={analyticsData.avgMfe}
                ruleBreaks={analyticsData.ruleBreaks}
                heatmap={analyticsData.heatmap}
              />
            ) : null}
          </div>
        </section>
      )}
    </div>
  );
}
