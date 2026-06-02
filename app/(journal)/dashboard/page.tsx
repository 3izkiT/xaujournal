"use client";

import dynamic from "next/dynamic";
import { useXauJournal } from "@/components/XauJournalContext";
import {
  getAverageDisciplineScore,
  getEquityCurve,
  getMonthlyDisciplineScore,
  getProfitFactor,
  getSessionPerformance,
  getSetupWinRateVsMistakes,
  getTotalPnl,
  getWinRate,
} from "@/lib/analytics";

const DashboardCharts = dynamic(
  () => import("@/components/DashboardCharts").then((m) => m.DashboardCharts),
  { ssr: false, loading: () => <p className="text-sm text-slate-400">Loading charts…</p> }
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
    </div>
  );
}
