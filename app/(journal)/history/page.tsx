"use client";

import Link from "next/link";
import { useXauJournal } from "@/components/XauJournalContext";

export default function HistoryPage() {
  const { trades, loading } = useXauJournal();

  if (loading) {
    return <p className="text-sm text-xau-muted">Loading history…</p>;
  }

  return (
    <div className="xau-page-wide">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-xau-gold-accent">Trade log</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">History</h1>
          <p className="mt-1 text-sm text-xau-muted">{trades.length} total entries</p>
        </div>
        <Link href="/journal-entry" className="xau-btn-gold">
          Log new trade
        </Link>
      </header>

      {trades.length === 0 ? (
        <div className="xau-card-bordered px-6 py-12 text-center text-sm text-xau-muted">
          No trades yet.{" "}
          <Link href="/journal-entry" className="font-medium text-xau-ink underline-offset-2 hover:underline">
            Add your first trade
          </Link>
        </div>
      ) : (
        <div className="xau-card-bordered overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-xau-border bg-xau-app text-xs uppercase tracking-wide text-xau-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Session</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Hold</th>
                <th className="px-4 py-3 font-medium">Net</th>
                <th className="px-4 py-3 font-medium">Discipline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-xau-border">
              {trades.map((trade) => (
                <tr key={trade.id} className="text-xau-ink">
                  <td className="px-4 py-3 whitespace-nowrap">{trade.date}</td>
                  <td className="px-4 py-3">{trade.type}</td>
                  <td className="px-4 py-3 text-xau-muted">{trade.session.replace(" Session", "")}</td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    {trade.holdTimeMinutes != null ? `${trade.holdTimeMinutes}m` : "—"}
                  </td>
                  <td className={`px-4 py-3 font-semibold ${trade.netProfitLoss >= 0 ? "text-tv-profit" : "text-tv-loss"}`}>
                    {trade.netProfitLoss >= 0 ? "+" : "-"}${Math.abs(trade.netProfitLoss).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">{trade.disciplineScore}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
