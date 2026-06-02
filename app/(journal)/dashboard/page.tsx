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
  { ssr: false, loading: () => <p className="text-sm text-slate-400">Loading charts…</p> }
);

const AdvancedAnalytics = dynamic(
  () => import("@/components/AdvancedAnalytics").then((m) => m.AdvancedAnalytics),
  { ssr: false, loading: () => <p className="text-sm text-slate-400">Loading analytics…</p> }
);

function cardTone(type: "mint" | "blue" | "pink" | "yellow") {
  if (type === "mint") return "border-emerald-100 bg-emerald-50";
  if (type === "pink") return "border-rose-100 bg-rose-50";
  if (type === "yellow") return "border-amber-100 bg-amber-50";
  return "border-sky-100 bg-sky-50";
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
    return <p className="text-sm text-slate-500">Loading your journal…</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold text-slate-900">Dashboard Overview</h2>
        <p className="mt-2 text-sm text-slate-500">High-level performance and discipline insights for XAUUSD only.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className={`rounded-2xl border p-5 ${cardTone("mint")}`}>
          <p className="text-sm text-slate-500">Win Rate</p>
          <p className="mt-2 text-3xl font-semibold text-slate-800">{winRate}%</p>
        </article>
        <article className={`rounded-2xl border p-5 ${cardTone("blue")}`}>
          <p className="text-sm text-slate-500">Discipline Score</p>
          <p className="mt-2 text-3xl font-semibold text-slate-800">{avgDiscipline}%</p>
          <p className="mt-1 text-xs text-slate-500">This month: {monthlyDiscipline}%</p>
        </article>
        <article className={`rounded-2xl border p-5 ${cardTone(totalPnl >= 0 ? "mint" : "pink")}`}>
          <p className="text-sm text-slate-500">Total Net P&L</p>
          <p className="mt-2 text-3xl font-semibold text-slate-800">${totalPnl.toFixed(2)}</p>
        </article>
        <article className={`rounded-2xl border p-5 ${cardTone("yellow")}`}>
          <p className="text-sm text-slate-500">Profit Factor</p>
          <p className="mt-2 text-3xl font-semibold text-slate-800">{profitFactor}</p>
        </article>
      </section>

      <DashboardCharts equityCurve={equityCurve} sessionData={sessionData} setupVsMistakes={setupVsMistakes} />

      <AdvancedAnalytics
        ruleBreaks={ruleBreaks}
        heatmap={heatmap}
        avgHoldMinutes={avgHoldMinutes}
        avgMae={avgMae}
        avgMfe={avgMfe}
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-medium text-slate-900">Recent trades</h3>
            <p className="text-xs text-slate-500">Latest manual logs for quick review.</p>
          </div>
          <Link
            href="/gallery"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            Open gallery
          </Link>
        </div>

        {recentTrades.length === 0 ? (
          <div className="rounded-xl bg-slate-50 px-4 py-6 text-sm text-slate-500">
            No trades yet. Add your first trade from Journal Entry.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
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
                  <tr key={trade.id} className="border-b border-slate-100 text-slate-700">
                    <td className="px-2 py-3">{trade.date}</td>
                    <td className="px-2 py-3">{trade.type}</td>
                    <td className="px-2 py-3">{trade.holdTimeMinutes != null ? `${trade.holdTimeMinutes}m` : "—"}</td>
                    <td className="px-2 py-3 text-xs text-slate-500">
                      {trade.mae != null ? trade.mae : "—"} / {trade.mfe != null ? trade.mfe : "—"}
                    </td>
                    <td className={`px-2 py-3 ${trade.netProfitLoss >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
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
