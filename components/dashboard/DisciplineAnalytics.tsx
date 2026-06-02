"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer } from "@/components/ChartContainer";
import { XAU_CHART } from "@/lib/chart-colors";

type RuleBreak = { label: string; count: number };
type HeatCell = { day: string; hour: number; pnl: number; count: number };

type Props = {
  ruleBreaks: RuleBreak[];
  heatmap: HeatCell[];
};

function heatColor(pnl: number, count: number) {
  const { heatmap } = XAU_CHART;
  if (!count) return heatmap.empty;
  if (pnl > 0) return pnl > 200 ? heatmap.posStrong : heatmap.posWeak;
  if (pnl < 0) return pnl < -200 ? heatmap.negStrong : heatmap.negWeak;
  return heatmap.neutral;
}

export function DisciplineAnalytics({ ruleBreaks, heatmap }: Props) {
  const activeHours = [0, 3, 6, 9, 12, 15, 18, 21];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <article className="xau-card-bordered p-5">
        <h4 className="text-sm font-medium text-xau-ink">Rule-break tracker</h4>
        <p className="mb-4 mt-0.5 text-xs text-xau-muted">Most broken checklist items.</p>
        <ChartContainer className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ruleBreaks} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid stroke={XAU_CHART.grid} strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} tick={{ fill: XAU_CHART.tick, fontSize: 11 }} />
              <YAxis type="category" dataKey="label" width={160} tick={{ fontSize: 11, fill: XAU_CHART.tick }} />
              <Tooltip />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {ruleBreaks.map((entry) => (
                  <Cell
                    key={entry.label}
                    fill={entry.count > 0 ? XAU_CHART.ruleBreak : XAU_CHART.ruleBreakEmpty}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </article>

      <article className="xau-card-bordered p-5">
        <h4 className="text-sm font-medium text-xau-ink">Day × hour heatmap</h4>
        <p className="mb-4 mt-0.5 text-xs text-xau-muted">Entry time · local timezone.</p>
        <div className="overflow-x-auto">
          <div className="min-w-[520px]">
            <div className="mb-2 grid grid-cols-[40px_repeat(8,1fr)] gap-1 text-[10px] text-xau-muted">
              <span />
              {activeHours.map((h) => (
                <span key={h} className="text-center">
                  {h}:00
                </span>
              ))}
            </div>
            {days.map((day) => (
              <div key={day} className="mb-1 grid grid-cols-[40px_repeat(8,1fr)] gap-1">
                <span className="pt-2 text-xs text-xau-muted">{day}</span>
                {activeHours.map((hour) => {
                  const cell = heatmap.find((c) => c.day === day && c.hour === hour);
                  const pnl = cell?.pnl ?? 0;
                  const count = cell?.count ?? 0;
                  return (
                    <div
                      key={`${day}-${hour}`}
                      title={count ? `${day} ${hour}:00 — $${pnl.toFixed(0)} (${count})` : "No trades"}
                      className="flex h-7 items-center justify-center rounded-md text-[10px] font-medium text-xau-ink"
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
    </div>
  );
}
