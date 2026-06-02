"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer } from "@/components/ChartContainer";

type RuleBreak = { label: string; count: number };
type HeatCell = { day: string; hour: number; pnl: number; count: number };

type Props = {
  ruleBreaks: RuleBreak[];
  heatmap: HeatCell[];
  avgHoldMinutes: number | null;
  avgMae: number | null;
  avgMfe: number | null;
};

function heatColor(pnl: number, count: number) {
  if (!count) return "#f1f5f9";
  if (pnl > 0) return pnl > 200 ? "#86efac" : "#bbf7d0";
  if (pnl < 0) return pnl < -200 ? "#fda4af" : "#fecdd3";
  return "#fde68a";
}

export function AdvancedAnalytics({ ruleBreaks, heatmap, avgHoldMinutes, avgMae, avgMfe }: Props) {
  const activeHours = [0, 3, 6, 9, 12, 15, 18, 21];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Avg hold time</p>
          <p className="mt-1 text-2xl font-semibold text-slate-800">
            {avgHoldMinutes != null ? `${avgHoldMinutes} min` : "—"}
          </p>
        </article>
        <article className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
          <p className="text-xs text-slate-500">Avg MAE (adverse)</p>
          <p className="mt-1 text-2xl font-semibold text-rose-700">
            {avgMae != null ? `$${avgMae}` : "—"}
          </p>
        </article>
        <article className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-xs text-slate-500">Avg MFE (favorable)</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-700">
            {avgMfe != null ? `$${avgMfe}` : "—"}
          </p>
        </article>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-medium text-slate-900">Rule-break tracker</h3>
        <p className="mb-4 text-xs text-slate-500">Which discipline rules you break most often.</p>
        <ChartContainer className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ruleBreaks} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="label" width={160} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {ruleBreaks.map((entry) => (
                  <Cell key={entry.label} fill={entry.count > 0 ? "#f9a8d4" : "#e2e8f0"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-medium text-slate-900">Day × hour heatmap (P&L)</h3>
        <p className="mb-4 text-xs text-slate-500">Entry time in your local timezone. Darker green = stronger edge.</p>
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="mb-2 grid grid-cols-[48px_repeat(8,1fr)] gap-1 text-[10px] text-slate-400">
              <span />
              {activeHours.map((h) => (
                <span key={h} className="text-center">
                  {h}:00
                </span>
              ))}
            </div>
            {days.map((day) => (
              <div key={day} className="mb-1 grid grid-cols-[48px_repeat(8,1fr)] gap-1">
                <span className="pt-2 text-xs text-slate-500">{day}</span>
                {activeHours.map((hour) => {
                  const cell = heatmap.find((c) => c.day === day && c.hour === hour);
                  const pnl = cell?.pnl ?? 0;
                  const count = cell?.count ?? 0;
                  return (
                    <div
                      key={`${day}-${hour}`}
                      title={count ? `${day} ${hour}:00 — $${pnl.toFixed(0)} (${count} trades)` : "No trades"}
                      className="flex h-8 items-center justify-center rounded-md text-[10px] font-medium text-slate-700"
                      style={{ backgroundColor: heatColor(pnl, count) }}
                    >
                      {count ? (pnl >= 0 ? "+" : "") + Math.round(pnl) : ""}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}
