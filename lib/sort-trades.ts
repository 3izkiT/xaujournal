import type { JournalTrade } from "@/lib/types";

/** Milliseconds for sort — prefers log time (createdAt), then optimistic id, then entry/date. */
export function tradeLoggedAtMs(trade: JournalTrade): number {
  if (trade.createdAt) {
    const t = new Date(trade.createdAt).getTime();
    if (Number.isFinite(t)) return t;
  }
  if (trade.id.startsWith("t-")) {
    const n = Number(trade.id.slice(2));
    if (Number.isFinite(n) && n > 0) return n;
  }
  if (trade.entryAt) {
    const t = new Date(trade.entryAt).getTime();
    if (Number.isFinite(t)) return t;
  }
  const d = new Date(`${trade.date}T12:00:00`).getTime();
  return Number.isFinite(d) ? d : 0;
}

/** Newest saved logs first; tie-break by trade date descending. */
export function sortTradesByLoggedAt(trades: JournalTrade[]): JournalTrade[] {
  return [...trades].sort((a, b) => {
    const byLogged = tradeLoggedAtMs(b) - tradeLoggedAtMs(a);
    if (byLogged !== 0) return byLogged;
    return b.date.localeCompare(a.date);
  });
}
