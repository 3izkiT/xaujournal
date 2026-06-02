"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { KpiCard } from "@/components/dashboard/KpiCard";
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

const DashboardCharts = dynamic(
  () => import("@/components/DashboardCharts").then((m) => m.DashboardCharts),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const ExecutionAnalytics = dynamic(
  () => import("@/components/dashboard/ExecutionAnalytics").then((m) => m.ExecutionAnalytics),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const DisciplineAnalytics = dynamic(
  () => import("@/components/dashboard/DisciplineAnalytics").then((m) => m.DisciplineAnalytics),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

function ChartSkeleton() {
  return <div className="h-48 animate-pulse rounded-2xl bg-xau-app" />;
}

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
  const recentTrades = trades.slice(0, 8);
  const tradeLabel = trades.length === 1 ? "1 trade logged" : `${trades.length} trades logged`;

  if (loading) {
    return <p className="text-sm text-xau-muted">Loading your journal…</p>;
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-xau-gold-accent">XAUUSD</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-xau-ink md:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-xau-muted">
            {trades.length === 0 ? "Log your first trade to unlock analytics." : tradeLabel}
          </p>
        </div>
        <Link href="/journal-entry" className="xau-btn-gold shrink-0">
          Log new trade
        </Link>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Win rate" value={`${winRate}%`} accent="mint" />
        <KpiCard
          label="Discipline"
          value={`${avgDiscipline}%`}
          hint={`This month: ${monthlyDiscipline}%`}
          accent="calm"
        />
        <KpiCard
          label="Net P&L"
          value={`${totalPnl >= 0 ? "+" : "-"}$${Math.abs(totalPnl).toFixed(2)}`}
          accent={totalPnl >= 0 ? "mint" : "rose"}
          valueClassName={totalPnl >= 0 ? "text-xau-profit" : "text-xau-loss"}
        />
        <KpiCard label="Profit factor" value={String(profitFactor)} accent="gold" />
      </div>

      <DashboardSection
        title="Performance trends"
        description="Cumulative equity and setup quality over your logged history."
      >
        <DashboardCharts equityCurve={equityCurve} setupVsMistakes={setupVsMistakes} />
      </DashboardSection>

      <DashboardSection
        title="Execution & sessions"
        description="How long you hold, excursion stats, and P&L by market session."
      >
        <ExecutionAnalytics
          sessionData={sessionData}
          avgHoldMinutes={avgHoldMinutes}
          avgMae={avgMae}
          avgMfe={avgMfe}
        />
      </DashboardSection>

      <DashboardSection
        title="Discipline & timing"
        description="Rule breaks and when you trade best during the week."
      >
        <DisciplineAnalytics ruleBreaks={ruleBreaks} heatmap={heatmap} />
      </DashboardSection>

      <DashboardSection
        title="Recent activity"
        description="Latest manual logs for quick review."
        action={
          <Link href="/gallery" className="xau-btn-ghost px-3 py-2 text-xs">
            Open gallery
          </Link>
        }
      >
        {recentTrades.length === 0 ? (
          <div className="rounded-xl bg-xau-app px-4 py-8 text-center text-sm text-xau-muted">
            No trades yet.{" "}
            <Link href="/journal-entry" className="font-medium text-xau-ink underline-offset-2 hover:underline">
              Add your first trade
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-xau-border">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-xau-app text-xs uppercase tracking-wide text-xau-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Hold</th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">MAE / MFE</th>
                  <th className="px-4 py-3 font-medium">Net</th>
                  <th className="px-4 py-3 font-medium">Discipline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-xau-border bg-xau-card">
                {recentTrades.map((trade) => (
                  <tr key={trade.id} className="text-xau-ink">
                    <td className="px-4 py-3 whitespace-nowrap">{trade.date}</td>
                    <td className="px-4 py-3">{trade.type}</td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      {trade.holdTimeMinutes != null ? `${trade.holdTimeMinutes}m` : "—"}
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-xau-muted md:table-cell">
                      {trade.mae ?? "—"} / {trade.mfe ?? "—"}
                    </td>
                    <td
                      className={`px-4 py-3 font-semibold ${trade.netProfitLoss >= 0 ? "text-xau-profit" : "text-xau-loss"}`}
                    >
                      {trade.netProfitLoss >= 0 ? "+" : "-"}${Math.abs(trade.netProfitLoss).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">{trade.disciplineScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardSection>
    </div>
  );
}
