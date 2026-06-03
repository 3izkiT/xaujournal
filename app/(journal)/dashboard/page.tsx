"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { useXauJournal } from "@/components/XauJournalContext";
import {
  getAverageDisciplineScore,
  getEquityCurve,
  getMonthlyDisciplineScore,
  getProfitFactor,
  getSessionPerformance,
  getTotalPnl,
  getWinRate,
} from "@/lib/analytics";

const EquityChart = dynamic(
  () => import("@/components/dashboard/EquityChart").then((m) => m.EquityChart),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-2xl bg-xau-card" /> }
);

const SessionMini = dynamic(
  () => import("@/components/dashboard/SessionMini").then((m) => m.SessionMini),
  { ssr: false, loading: () => <div className="h-40 animate-pulse rounded-2xl bg-xau-card" /> }
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
  const recentTrades = trades.slice(0, 5);

  if (loading) {
    return <p className="text-sm text-xau-muted">Loading your journal…</p>;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-xau-ink md:text-[1.75rem]">
            {trades.length === 0 ? "Welcome back" : "Performance overview"}
          </h1>
          <p className="mt-1 text-sm text-xau-muted">
            {trades.length === 0
              ? "Log your first XAUUSD trade to unlock your terminal."
              : `${trades.length} trade${trades.length === 1 ? "" : "s"} · discipline-first journal`}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/analytics" className="xau-btn-ghost hidden sm:inline-flex">
            Full analytics
          </Link>
          <Link href="/journal-entry" className="xau-btn-gold">
            Log trade
          </Link>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Win rate" value={`${winRate}%`} accent="profit" />
        <KpiCard label="Discipline" value={`${avgDiscipline}%`} hint={`Month: ${monthlyDiscipline}%`} accent="calm" />
        <KpiCard
          label="Net P&L"
          value={`${totalPnl >= 0 ? "+" : "-"}$${Math.abs(totalPnl).toFixed(2)}`}
          accent={totalPnl >= 0 ? "profit" : "loss"}
          valueClassName={totalPnl >= 0 ? "text-tv-profit" : "text-tv-loss"}
        />
        <KpiCard label="Profit factor" value={String(profitFactor)} accent="gold" />
      </div>

      <EquityChart equityCurve={equityCurve} />

      <div className="grid gap-4 lg:grid-cols-5">
        <article className="xau-card-bordered lg:col-span-3">
          <div className="flex items-center justify-between border-b border-xau-border px-4 py-3">
            <h2 className="text-sm font-semibold text-xau-ink">Recent trades</h2>
            <Link href="/history" className="text-xs font-medium text-xau-muted hover:text-xau-ink">
              View all →
            </Link>
          </div>
          {recentTrades.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-xau-muted">No trades logged yet.</p>
          ) : (
            <ul className="divide-y divide-xau-border">
              {recentTrades.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-xau-ink">{t.date}</p>
                    <p className="text-xs text-xau-muted">
                      {t.type} · {t.disciplineScore}% discipline
                    </p>
                  </div>
                  <p className={`shrink-0 font-semibold ${t.netProfitLoss >= 0 ? "text-tv-profit" : "text-tv-loss"}`}>
                    {t.netProfitLoss >= 0 ? "+" : "-"}${Math.abs(t.netProfitLoss).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </article>

        <div className="lg:col-span-2">
          <SessionMini sessionData={sessionData} />
        </div>
      </div>

      <Link
        href="/analytics"
        className="flex items-center justify-between rounded-2xl border border-xau-border bg-xau-card px-5 py-4 transition hover:shadow-card"
      >
        <div>
          <p className="text-sm font-semibold text-xau-ink">Open full analytics</p>
          <p className="text-xs text-xau-muted">Setup tags, heatmap, rule breaks, MAE/MFE</p>
        </div>
        <span className="text-xau-gold-accent" aria-hidden>
          →
        </span>
      </Link>
    </div>
  );
}
