"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { TradeDetailCard } from "@/components/journal/TradeDetailCard";
import { TradeEditForm } from "@/components/journal/TradeEditForm";
import { useXauJournal } from "@/components/XauJournalContext";

function HistoryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justSaved = searchParams.get("saved") === "1";
  const tradeFromUrl = searchParams.get("trade");
  const { trades, loading, removeTrade } = useXauJournal();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const selectedTrade = useMemo(
    () => trades.find((t) => t.id === selectedId) ?? null,
    [trades, selectedId]
  );

  const editingTrade = useMemo(
    () => (editingId ? trades.find((t) => t.id === editingId) ?? null : null),
    [trades, editingId]
  );

  useEffect(() => {
    if (tradeFromUrl && trades.some((t) => t.id === tradeFromUrl)) {
      setSelectedId(tradeFromUrl);
    }
  }, [tradeFromUrl, trades]);

  useEffect(() => {
    if (!selectedId) return;
    const el = document.getElementById("trade-detail");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedId]);

  const openTrade = (id: string) => {
    setEditingId(null);
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
    if (editingId === tradeId) setEditingId(null);
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
            {trades.length} total entries · click <span className="font-medium text-xau-ink">View</span> for full notes
            and charts
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

      {editingTrade && (
        <TradeEditForm trade={editingTrade} onClose={() => setEditingId(null)} onSaved={() => setSelectedId(editingTrade.id)} />
      )}

      {trades.length === 0 ? (
        <div className="xau-card-bordered px-6 py-12 text-center text-sm text-xau-muted">
          No trades yet.{" "}
          <Link href="/journal-entry" className="font-medium text-xau-ink underline-offset-2 hover:underline">
            Add your first trade
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-3 md:hidden" aria-label="Trade history">
            {trades.map((trade) => {
              const preview =
                trade.noteContext.trim() || trade.noteMistake.trim() || trade.noteNextAction.trim();
              const isSelected = selectedId === trade.id;
              return (
                <li
                  key={trade.id}
                  className={`xau-card-bordered p-4 ${isSelected ? "ring-1 ring-xau-gold-accent/50" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-xau-ink">{trade.date}</p>
                      <p className="mt-0.5 text-xs text-xau-muted">
                        {trade.type} · {trade.session.replace(" Session", "")}
                      </p>
                      {preview ? (
                        <p className="mt-2 line-clamp-2 text-xs text-xau-muted">{preview}</p>
                      ) : null}
                    </div>
                    <p
                      className={`shrink-0 text-sm font-semibold ${trade.netProfitLoss >= 0 ? "text-tv-profit" : "text-tv-loss"}`}
                    >
                      {trade.netProfitLoss >= 0 ? "+" : "-"}${Math.abs(trade.netProfitLoss).toFixed(2)}
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-xau-muted">Discipline {trade.disciplineScore}%</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => openTrade(trade.id)}
                      className="xau-btn-link-gold"
                    >
                      {isSelected ? "Viewing" : "View"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(trade.id);
                        setEditingId(trade.id);
                      }}
                      className="xau-btn-link"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === trade.id}
                      onClick={() => void handleDelete(trade.id, trade.date)}
                      className="xau-btn-link-danger disabled:opacity-50"
                    >
                      {deletingId === trade.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="xau-card-bordered hidden overflow-x-auto md:block">
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
              {trades.map((trade) => {
                const preview = trade.noteContext.trim() || trade.noteMistake.trim() || trade.noteNextAction.trim();
                const isSelected = selectedId === trade.id;
                return (
                  <tr key={trade.id} className={`text-xau-ink ${isSelected ? "bg-xau-gold-soft/40" : ""}`}>
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
                          className="xau-btn-link-gold"
                        >
                          {isSelected ? "Viewing" : "View"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedId(trade.id);
                            setEditingId(trade.id);
                          }}
                          className="xau-btn-link"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === trade.id}
                          onClick={() => void handleDelete(trade.id, trade.date)}
                          className="xau-btn-link-danger disabled:opacity-50"
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
        </>
      )}

      {selectedTrade && !editingId && (
        <div id="trade-detail">
          <TradeDetailCard trade={selectedTrade} onClose={closeDetail} />
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<p className="text-sm text-xau-muted">Loading history…</p>}>
      <HistoryPageContent />
    </Suspense>
  );
}
