"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "@/components/ChartContainer";
import { XAU_CHART } from "@/lib/chart-colors";

type RuleBreak = { label: string; count: number };
type HeatCell = { day: string; hour: number; pnl: number; count: number };
type SessionRow = { name: string; value: number };

type Props = {
  ruleBreaks: RuleBreak[];
  heatmap: HeatCell[];
  sessionData: SessionRow[];
  avgHoldMinutes: number | null;
  avgMae: number | null;
  avgMfe: number | null;
};

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function heatColor(pnl: number, count: number) {
  const { heatmap } = XAU_CHART;
  if (!count) return heatmap.empty;
  if (pnl > 0) return pnl > 200 ? heatmap.posStrong : heatmap.posWeak;
  if (pnl < 0) return pnl < -200 ? heatmap.negStrong : heatmap.negWeak;
  return heatmap.neutral;
}

function StatCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "rose" | "mint";
}) {
  const toneClass =
    tone === "rose" ? "xau-kpi-loss" : tone === "mint" ? "xau-kpi-profit" : "xau-card-bordered";

  return (
    <article className={`flex min-h-[88px] flex-col justify-center p-4 ${toneClass}`}>
      <p className="text-xs text-xau-muted">{label}</p>
      <p
        className={`mt-1 text-xl font-semibold sm:text-2xl ${
          tone === "rose" ? "text-tv-loss" : tone === "mint" ? "text-tv-profit" : "text-xau-ink"
        }`}
      >
        {value}
      </p>
    </article>
  );
}

export function AdvancedAnalytics({
  ruleBreaks,
  heatmap,
  sessionData,
  avgHoldMinutes,
  avgMae,
  avgMfe,
}: Props) {
  const activeHours = [0, 3, 6, 9, 12, 15, 18, 21];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hasSessionPnl = sessionData.some((s) => s.value !== 0);

  return (
    <section className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="grid gap-4 sm:grid-cols-3 lg:col-span-5">
          <StatCard
            label="Avg hold time"
            value={avgHoldMinutes != null ? `${avgHoldMinutes} min` : "—"}
          />
          <StatCard label="Avg MAE (adverse)" value={avgMae != null ? `$${avgMae}` : "—"} tone="rose" />
          <StatCard label="Avg MFE (favorable)" value={avgMfe != null ? `$${avgMfe}` : "—"} tone="mint" />
        </div>

        <article className="xau-card-bordered p-4 md:p-5 lg:col-span-7">
          <h3 className="text-lg font-medium text-xau-ink">Session Performance (P&L)</h3>
          <p className="mt-1 text-xs text-xau-muted">Net P&L by Sydney, Tokyo, London, and New York (Thailand time).</p>

          {!hasSessionPnl ? (
            <div className="mt-4 flex h-40 items-center justify-center rounded-xl bg-xau-app text-sm text-xau-muted">
              Log trades with a session tag to compare performance.
            </div>
          ) : (
            <ChartContainer className="mt-3 h-40 sm:h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke={XAU_CHART.grid} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: XAU_CHART.tick }} />
                  <YAxis tickFormatter={(v) => formatUsd(Number(v))} width={64} tick={{ fontSize: 10, fill: XAU_CHART.tick }} />
                  <Tooltip formatter={(value) => formatUsd(Number(value ?? 0))} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={56}>
                    {sessionData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          entry.value >= 0
                            ? XAU_CHART.sessionPositive[index % XAU_CHART.sessionPositive.length]
                            : XAU_CHART.sessionLoss
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </article>
      </div>

      <article className="xau-card-bordered p-5">
        <h3 className="text-lg font-medium text-xau-ink">Rule-break tracker</h3>
        <p className="mb-4 text-xs text-xau-muted">Which discipline rules you break most often.</p>
        <ChartContainer className="h-56">
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
        <h3 className="text-lg font-medium text-xau-ink">Day × hour heatmap (P&L)</h3>
        <p className="mb-4 text-xs text-xau-muted">Entry time in your local timezone. Softer green = stronger edge.</p>
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="mb-2 grid grid-cols-[48px_repeat(8,1fr)] gap-1 text-[10px] text-xau-muted">
              <span />
              {activeHours.map((h) => (
                <span key={h} className="text-center">
                  {h}:00
                </span>
              ))}
            </div>
            {days.map((day) => (
              <div key={day} className="mb-1 grid grid-cols-[48px_repeat(8,1fr)] gap-1">
                <span className="pt-2 text-xs text-xau-muted">{day}</span>
                {activeHours.map((hour) => {
                  const cell = heatmap.find((c) => c.day === day && c.hour === hour);
                  const pnl = cell?.pnl ?? 0;
                  const count = cell?.count ?? 0;
                  return (
                    <div
                      key={`${day}-${hour}`}
                      title={count ? `${day} ${hour}:00 — $${pnl.toFixed(0)} (${count} trades)` : "No trades"}
                      className="flex h-8 items-center justify-center rounded-md text-[10px] font-medium text-xau-ink"
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
