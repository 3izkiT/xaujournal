"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer } from "@/components/ChartContainer";
import { PanelHeading } from "@/components/ui/HelpTooltip";
import type { ChartPalette } from "@/lib/chart-colors";
import { useChartPalette } from "@/lib/use-chart-palette";

type RuleBreak = { label: string; count: number };
type HeatCell = { day: string; hour: number; pnl: number; count: number };

type Props = {
  ruleBreaks: RuleBreak[];
  heatmap: HeatCell[];
};

function heatColor(pnl: number, count: number, palette: ChartPalette) {
  const { heatmap } = palette;
  if (!count) return heatmap.empty;
  if (pnl > 0) return pnl > 200 ? heatmap.posStrong : heatmap.posWeak;
  if (pnl < 0) return pnl < -200 ? heatmap.negStrong : heatmap.negWeak;
  return heatmap.neutral;
}

export function DisciplineAnalytics({ ruleBreaks, heatmap }: Props) {
  const palette = useChartPalette();
  const activeHours = [0, 3, 6, 9, 12, 15, 18, 21];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <article className="xau-card-bordered p-5">
        <PanelHeading
          as="h4"
          className="mb-4"
          title="Rule-break tracker"
          term="ruleBreakTracker"
          description="Most broken checklist items."
        />
        <ChartContainer className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ruleBreaks} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid stroke={palette.grid} strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} tick={{ fill: palette.tick, fontSize: 11 }} />
              <YAxis type="category" dataKey="label" width={160} tick={{ fontSize: 11, fill: palette.tick }} />
              <Tooltip />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {ruleBreaks.map((entry) => (
                  <Cell
                    key={entry.label}
                    fill={entry.count > 0 ? palette.ruleBreak : palette.ruleBreakEmpty}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </article>

      <article className="xau-card-bordered p-5">
        <PanelHeading
          as="h4"
          className="mb-4"
          title="Day × hour heatmap"
          term="dayHourHeatmap"
          description="Green / red like TradingView — entry time in your timezone."
        />
        <div className="overflow-x-hidden md:overflow-x-auto">
          <div className="w-full min-w-0 md:min-w-[520px]">
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
                      className={`flex h-7 items-center justify-center rounded-md text-[10px] font-medium ${
                        count && pnl !== 0 ? (pnl > 0 ? "text-tv-profit" : "text-tv-loss") : "text-xau-muted"
                      }`}
                      style={{ backgroundColor: heatColor(pnl, count, palette) }}
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
