"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { JournalTrade } from "@/lib/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function pnlTone(value: number) {
  if (value > 0) return "bg-[var(--xau-profit-bg)] text-tv-profit border-[var(--xau-profit)]/20";
  if (value < 0) return "bg-[var(--xau-loss-bg)] text-tv-loss border-[var(--xau-loss)]/20";
  return "bg-xau-gold-soft/50 text-xau-ink border-xau-border";
}

function monthLabel(year: number, month: number) {
  return new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

type Props = {
  trades: JournalTrade[];
};

export function TradeCalendarPanel({ trades }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const entriesByDate = useMemo(() => {
    const map = new Map<string, { pnl: number; count: number }>();
    for (const trade of trades) {
      const prev = map.get(trade.date) ?? { pnl: 0, count: 0 };
      map.set(trade.date, { pnl: prev.pnl + trade.netProfitLoss, count: prev.count + 1 });
    }
    return map;
  }, [trades]);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: Array<number | null> = [];
  for (let i = 0; i < firstDay; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  return (
    <article id="calendar" className="xau-card-bordered scroll-mt-24 p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-xau-ink">Trade calendar</h2>
          <p className="mt-0.5 text-xs text-xau-muted">Daily P&L from trades you log on purpose</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-xau-border text-xau-muted transition hover:bg-xau-app hover:text-xau-ink"
            aria-label="Previous month"
          >
            ‹
          </button>
          <span className="min-w-[9.5rem] text-center text-sm font-medium text-xau-ink">{monthLabel(viewYear, viewMonth)}</span>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            disabled={isCurrentMonth}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-xau-border text-xau-muted transition hover:bg-xau-app hover:text-xau-ink disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next month"
          >
            ›
          </button>
          {!isCurrentMonth && (
            <button
              type="button"
              onClick={() => {
                setViewYear(today.getFullYear());
                setViewMonth(today.getMonth());
              }}
              className="ml-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-xau-gold-accent hover:underline"
            >
              Today
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] sm:gap-2 sm:text-xs">
        {WEEKDAYS.map((name) => (
          <div key={name} className="py-1 font-medium text-xau-muted sm:py-2">
            <span className="hidden sm:inline">{name}</span>
            <span className="sm:hidden">{name.slice(0, 1)}</span>
          </div>
        ))}
        {cells.map((day, index) => {
          if (!day) {
            return (
              <div
                key={`empty-${viewYear}-${viewMonth}-${index}`}
                className="min-h-[3.25rem] rounded-xl border border-dashed border-xau-border/80 sm:min-h-[5.5rem] sm:rounded-2xl"
              />
            );
          }
          const isoDate = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const entry = entriesByDate.get(isoDate);
          const pnl = entry?.pnl ?? 0;
          const count = entry?.count ?? 0;
          const isToday =
            viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();

          const inner = (
            <div
              className={`flex min-h-[3.25rem] flex-col rounded-xl border p-1.5 text-left transition sm:min-h-[5.5rem] sm:rounded-2xl sm:p-3 ${
                count ? pnlTone(pnl) : "border-xau-border bg-xau-card"
              } ${isToday ? "ring-1 ring-xau-gold-accent/50" : ""}`}
            >
              <p className="text-[10px] font-medium sm:text-xs">{day}</p>
              {count > 0 ? (
                <>
                  <p className="mt-0.5 text-[10px] font-semibold sm:mt-2 sm:text-sm">
                    {pnl >= 0 ? "+" : "-"}${Math.abs(pnl).toFixed(0)}
                  </p>
                  <p className="mt-auto hidden text-[10px] opacity-80 sm:block">
                    {count} trade{count === 1 ? "" : "s"}
                  </p>
                </>
              ) : (
                <p className="mt-auto hidden text-[10px] text-xau-muted sm:block">—</p>
              )}
            </div>
          );

          if (!count) {
            return <div key={isoDate}>{inner}</div>;
          }

          const dayTradeId = trades
            .filter((t) => t.date === isoDate)
            .sort((a, b) => (b.entryAt ?? "").localeCompare(a.entryAt ?? ""))[0]?.id;

          return (
            <Link
              key={isoDate}
              href={dayTradeId ? `/history?trade=${encodeURIComponent(dayTradeId)}` : "/history"}
              className="block hover:opacity-90"
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </article>
  );
}
