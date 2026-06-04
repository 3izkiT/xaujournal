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
import { HelpTooltip, PanelHeading } from "@/components/ui/HelpTooltip";
import type { TooltipTerm } from "@/lib/term-tooltips";
import { useChartPalette } from "@/lib/use-chart-palette";

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

function MiniStat({
  label,
  value,
  tone,
  tooltipTerm,
}: {
  label: string;
  value: string;
  tone?: "profit" | "loss" | "neutral";
  tooltipTerm?: TooltipTerm;
}) {
  const bg =
    tone === "profit"
      ? "bg-[var(--xau-profit-bg)]"
      : tone === "loss"
        ? "bg-[var(--xau-loss-bg)]"
        : "bg-xau-app";
  const text =
    tone === "profit" ? "text-tv-profit" : tone === "loss" ? "text-tv-loss" : "text-xau-ink";

  return (
    <div className={`rounded-xl border border-xau-border ${bg} p-4`}>
      <p className="inline-flex items-center gap-1 text-xs text-xau-muted">
        {label}
        {tooltipTerm ? <HelpTooltip term={tooltipTerm} label={`About ${label}`} size="sm" placement="above" /> : null}
      </p>
      <p className={`mt-1 text-xl font-semibold ${text}`}>{value}</p>
    </div>
  );
}

export function ExecutionAnalytics({ sessionData, avgHoldMinutes, avgMae, avgMfe }: Props) {
  const palette = useChartPalette();
  const hasSessionPnl = sessionData.some((s) => s.value !== 0);

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="grid gap-3 sm:grid-cols-3 lg:col-span-4 lg:grid-cols-1">
        <MiniStat label="Avg hold time" tooltipTerm="avgHoldTime" value={avgHoldMinutes != null ? `${avgHoldMinutes} min` : "—"} />
        <MiniStat label="Avg MAE" tooltipTerm="mae" value={avgMae != null ? `$${avgMae}` : "—"} tone="loss" />
        <MiniStat label="Avg MFE" tooltipTerm="mfe" value={avgMfe != null ? `$${avgMfe}` : "—"} tone="profit" />
      </div>

      <article className="xau-card-bordered p-4 md:p-5 lg:col-span-8">
        <PanelHeading
          as="h4"
          title="Session P&L"
          term="sessionPnl"
          description="London · New York · Asian"
        />
        {!hasSessionPnl ? (
          <div className="mt-4 flex h-44 items-center justify-center rounded-xl bg-xau-app text-sm text-xau-muted">
            Tag sessions on journal entries to compare performance.
          </div>
        ) : (
          <ChartContainer className="mt-3 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={palette.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: palette.tick }} />
                <YAxis tickFormatter={(v) => formatUsd(Number(v))} width={64} tick={{ fontSize: 10, fill: palette.tick }} />
                <Tooltip formatter={(value) => formatUsd(Number(value ?? 0))} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={64}>
                  {sessionData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={
                        entry.value >= 0
                          ? palette.sessionPositive[index % palette.sessionPositive.length]
                          : palette.sessionLoss
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
