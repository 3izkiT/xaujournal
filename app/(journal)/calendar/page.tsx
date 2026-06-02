"use client";

import { useMemo } from "react";
import { useXauJournal } from "@/components/XauJournalContext";

function pnlTone(value: number) {
  if (value > 0) return "bg-emerald-100 text-emerald-700";
  if (value < 0) return "bg-rose-100 text-rose-700";
  return "bg-amber-100 text-amber-700";
}

export default function CalendarPage() {
  const { trades } = useXauJournal();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const entriesByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const trade of trades) {
      map.set(trade.date, (map.get(trade.date) || 0) + trade.netProfitLoss);
    }
    return map;
  }, [trades]);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: Array<number | null> = [];
  for (let i = 0; i < firstDay; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-slate-900">Calendar View</h2>
        <p className="mt-2 text-sm text-slate-500">Visualize consistency with daily pastel P&L blocks.</p>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((name) => (
          <div key={name} className="py-2 font-medium text-slate-500">
            {name}
          </div>
        ))}
        {cells.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} className="h-24 rounded-2xl border border-dashed border-slate-100" />;
          const isoDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const pnl = entriesByDate.get(isoDate) ?? 0;
          return (
            <div key={isoDate} className={`h-24 rounded-2xl p-3 text-left ${pnlTone(pnl)}`}>
              <p className="text-xs">{day}</p>
              <p className="mt-2 text-sm font-semibold">${pnl.toFixed(0)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
