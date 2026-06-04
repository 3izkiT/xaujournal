"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { TradeDetailCard } from "@/components/journal/TradeDetailCard";
import { useXauJournal } from "@/components/XauJournalContext";
import { sortTradesByLoggedAt } from "@/lib/sort-trades";

export default function HistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justSaved = searchParams.get("saved") === "1";
  const tradeFromUrl = searchParams.get("trade");
  const { trades, loading, removeTrade } = useXauJournal();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const sortedTrades = useMemo(() => sortTradesByLoggedAt(trades), [trades]);

  const selectedTrade = useMemo(
    () => sortedTrades.find((t) => t.id === selectedId) ?? null,
    [sortedTrades, selectedId]
  );

  useEffect(() => {
    if (tradeFromUrl && sortedTrades.some((t) => t.id === tradeFromUrl)) {
      setSelectedId(tradeFromUrl);
    }
  }, [tradeFromUrl, sortedTrades]);

  useEffect(() => {
    if (!selectedId) return;
    const el = document.getElementById("trade-detail");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedId]);

  const openTrade = (id: string) => {
    setSelectedId(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set("trade", id);
    params.delete("saved");
    router.replace(`/history?${params.toString()}`, { scroll: false });
  };

  const closeDetail = () => {
    setSelectedId(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("trade");
    router.replace(params.size ? `/history?${params.toString()}` : "/history", { scroll: false });
  };

  const handleDelete = async (tradeId: string, date: string) => {
    if (!window.confirm(`Delete trade log from ${date}? This cannot be undone.`)) return;
    setDeleteError(null);
    setDeletingId(tradeId);
    const result = await removeTrade(tradeId);
    setDeletingId(null);
    if (!result.ok) {
      setDeleteError(result.error ?? "Could not delete trade.");
      return;
    }
    if (selectedId === tradeId) closeDetail();
  };

  if (loading) {
    return <p className="text-sm text-xau-muted">Loading history…</p>;
  }

  return (
    <div className="xau-page-wide space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-xau-gold-accent">Trade log</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">History</h1>
          <p className="mt-1 text-sm text-xau-muted">
            {sortedTrades.length} total entries · click <span className="font-medium text-xau-ink">View</span> for notes and charts (tap images to expand)
          </p>
        </div>
        <Link href="/journal-entry" className="xau-btn-gold">
          Log new trade
        </Link>
      </header>

      {justSaved && (
        <div
          className="rounded-2xl border border-xau-profit bg-xau-profit-bg px-4 py-3 text-sm text-xau-ink"
          role="status"
        >
          Trade saved. Open the latest row with <span className="font-medium">View</span> to read your reflection notes.
        </div>
      )}

      {deleteError && (
        <div className="rounded-2xl border border-xau-border bg-xau-rose px-4 py-3 text-sm text-xau-loss" role="alert">
          {deleteError}
        </div>
      )}

      {sortedTrades.length === 0 ? (
        <div className="xau-card-bordered px-6 py-12 text-center text-sm text-xau-muted">
          No trades yet.{" "}
          <Link href="/journal-entry" className="font-medium text-xau-ink underline-offset-2 hover:underline">
            Add your first trade
          </Link>
        </div>
      ) : (
        <div className="xau-card-bordered overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-xau-border bg-xau-app text-xs uppercase tracking-wide text-xau-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Session</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Notes</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Hold</th>
                <th className="px-4 py-3 font-medium">Net</th>
                <th className="px-4 py-3 font-medium">Discipline</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-xau-border">
              {sortedTrades.map((trade) => {
                const preview = trade.noteContext.trim() || trade.noteMistake.trim() || trade.noteNextAction.trim();
                const isSelected = selectedId === trade.id;
                return (
                  <tr
                    key={trade.id}
                    className={`text-xau-ink ${isSelected ? "bg-xau-gold-soft/40" : ""}`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">{trade.date}</td>
                    <td className="px-4 py-3">{trade.type}</td>
                    <td className="px-4 py-3 text-xau-muted">{trade.session.replace(" Session", "")}</td>
                    <td className="hidden max-w-[200px] truncate px-4 py-3 text-xau-muted md:table-cell" title={preview}>
                      {preview ? `${preview.slice(0, 48)}${preview.length > 48 ? "…" : ""}` : "—"}
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      {trade.holdTimeMinutes != null ? `${trade.holdTimeMinutes}m` : "—"}
                    </td>
                    <td
                      className={`px-4 py-3 font-semibold ${trade.netProfitLoss >= 0 ? "text-tv-profit" : "text-tv-loss"}`}
                    >
                      {trade.netProfitLoss >= 0 ? "+" : "-"}${Math.abs(trade.netProfitLoss).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">{trade.disciplineScore}%</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => openTrade(trade.id)}
                          className="text-xs font-medium text-xau-gold-accent hover:underline"
                        >
                          {isSelected ? "Viewing" : "View"}
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === trade.id}
                          onClick={() => void handleDelete(trade.id, trade.date)}
                          className="text-xs font-medium text-xau-loss hover:underline disabled:opacity-50"
                        >
                          {deletingId === trade.id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedTrade && (
        <div id="trade-detail">
          <TradeDetailCard trade={selectedTrade} onClose={closeDetail} />
        </div>
      )}
    </div>
  );
}
