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

type SessionRow = { name: string; value: number };

type Props = {
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

function MiniStat({ label, value, tone }: { label: string; value: string; tone?: "mint" | "rose" | "neutral" }) {
  const bg =
    tone === "mint" ? "bg-xau-mint" : tone === "rose" ? "bg-xau-rose" : "bg-xau-app";
  return (
    <div className={`rounded-xl border border-xau-border ${bg} p-4`}>
      <p className="text-xs text-xau-muted">{label}</p>
      <p
        className={`mt-1 text-xl font-semibold ${
          tone === "mint" ? "text-xau-profit" : tone === "rose" ? "text-xau-loss" : "text-xau-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function ExecutionAnalytics({ sessionData, avgHoldMinutes, avgMae, avgMfe }: Props) {
  const hasSessionPnl = sessionData.some((s) => s.value !== 0);

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="grid gap-3 sm:grid-cols-3 lg:col-span-4 lg:grid-cols-1">
        <MiniStat label="Avg hold time" value={avgHoldMinutes != null ? `${avgHoldMinutes} min` : "—"} />
        <MiniStat label="Avg MAE" value={avgMae != null ? `$${avgMae}` : "—"} tone="rose" />
        <MiniStat label="Avg MFE" value={avgMfe != null ? `$${avgMfe}` : "—"} tone="mint" />
      </div>

      <article className="xau-card-bordered p-4 md:p-5 lg:col-span-8">
        <h4 className="text-sm font-medium text-xau-ink">Session P&L</h4>
        <p className="mt-0.5 text-xs text-xau-muted">London · New York · Asian</p>
        {!hasSessionPnl ? (
          <div className="mt-4 flex h-44 items-center justify-center rounded-xl bg-xau-app text-sm text-xau-muted">
            Tag sessions on journal entries to compare performance.
          </div>
        ) : (
          <ChartContainer className="mt-3 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={XAU_CHART.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: XAU_CHART.tick }} />
                <YAxis tickFormatter={(v) => formatUsd(Number(v))} width={64} tick={{ fontSize: 10, fill: XAU_CHART.tick }} />
                <Tooltip formatter={(value) => formatUsd(Number(value ?? 0))} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={64}>
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
  );
}
