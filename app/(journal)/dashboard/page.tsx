"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
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
  { ssr: false, loading: () => <p className="text-sm text-xau-muted">Loading charts…</p> }
);

const AdvancedAnalytics = dynamic(
  () => import("@/components/AdvancedAnalytics").then((m) => m.AdvancedAnalytics),
  { ssr: false, loading: () => <p className="text-sm text-xau-muted">Loading analytics…</p> }
);

function cardTone(type: "mint" | "calm" | "rose" | "gold") {
  if (type === "mint") return "xau-kpi-mint";
  if (type === "rose") return "xau-kpi-rose";
  if (type === "gold") return "xau-kpi-gold";
  return "xau-kpi-calm";
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

  if (loading) {
    return <p className="text-sm text-xau-muted">Loading your journal…</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold text-xau-ink">Dashboard Overview</h2>
        <p className="mt-2 text-sm text-xau-muted">High-level performance and discipline insights for XAUUSD only.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className={cardTone("mint")}>
          <p className="text-sm text-xau-muted">Win Rate</p>
          <p className="mt-2 text-3xl font-semibold text-xau-ink">{winRate}%</p>
        </article>
        <article className={cardTone("calm")}>
          <p className="text-sm text-xau-muted">Discipline Score</p>
          <p className="mt-2 text-3xl font-semibold text-xau-ink">{avgDiscipline}%</p>
          <p className="mt-1 text-xs text-xau-muted">This month: {monthlyDiscipline}%</p>
        </article>
        <article className={cardTone(totalPnl >= 0 ? "mint" : "rose")}>
          <p className="text-sm text-xau-muted">Total Net P&L</p>
          <p className="mt-2 text-3xl font-semibold text-xau-ink">${totalPnl.toFixed(2)}</p>
        </article>
        <article className={cardTone("gold")}>
          <p className="text-sm text-xau-muted">Profit Factor</p>
          <p className="mt-2 text-3xl font-semibold text-xau-ink">{profitFactor}</p>
        </article>
      </section>

      <DashboardCharts equityCurve={equityCurve} setupVsMistakes={setupVsMistakes} />

      <AdvancedAnalytics
        ruleBreaks={ruleBreaks}
        heatmap={heatmap}
        sessionData={sessionData}
        avgHoldMinutes={avgHoldMinutes}
        avgMae={avgMae}
        avgMfe={avgMfe}
      />

      <section className="xau-card-bordered p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-medium text-xau-ink">Recent trades</h3>
            <p className="text-xs text-xau-muted">Latest manual logs for quick review.</p>
          </div>
          <Link href="/gallery" className="xau-btn-ghost px-3 py-2">
            Open gallery
          </Link>
        </div>

        {recentTrades.length === 0 ? (
          <div className="rounded-xl bg-xau-app px-4 py-6 text-sm text-xau-muted">
            No trades yet. Add your first trade from Journal Entry.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-xau-border text-xs uppercase tracking-wide text-xau-muted">
                <tr>
                  <th className="px-2 py-3">Date</th>
                  <th className="px-2 py-3">Type</th>
                  <th className="px-2 py-3">Hold</th>
                  <th className="px-2 py-3">MAE/MFE</th>
                  <th className="px-2 py-3">Net</th>
                  <th className="px-2 py-3">Discipline</th>
                </tr>
              </thead>
              <tbody>
                {recentTrades.map((trade) => (
                  <tr key={trade.id} className="border-b border-xau-border text-xau-ink">
                    <td className="px-2 py-3">{trade.date}</td>
                    <td className="px-2 py-3">{trade.type}</td>
                    <td className="px-2 py-3">{trade.holdTimeMinutes != null ? `${trade.holdTimeMinutes}m` : "—"}</td>
                    <td className="px-2 py-3 text-xs text-xau-muted">
                      {trade.mae != null ? trade.mae : "—"} / {trade.mfe != null ? trade.mfe : "—"}
                    </td>
                    <td className={`px-2 py-3 font-medium ${trade.netProfitLoss >= 0 ? "text-xau-profit" : "text-xau-loss"}`}>
                      {trade.netProfitLoss >= 0 ? "+" : "-"}${Math.abs(trade.netProfitLoss).toFixed(2)}
                    </td>
                    <td className="px-2 py-3">{trade.disciplineScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
