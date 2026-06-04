"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "@/components/ChartContainer";
import { OVERVIEW_CHART_PLOT_HEIGHT, overviewChartCardClass } from "@/lib/dashboard-charts";
import { useChartPalette } from "@/lib/use-chart-palette";

export type EquityPoint = {
  date: string;
  label: string;
  tradeIndex: number;
  equity: number;
  change: number;
};

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function EquityTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: EquityPoint }[];
}) {
  if (!active || !payload?.[0]?.payload) return null;
  const point = payload[0].payload;
  if (point.tradeIndex === 0) {
    return (
      <div className="rounded-xl border border-xau-border bg-xau-card px-3 py-2 text-xs shadow-card">
        <p className="font-medium text-xau-ink">Starting balance</p>
        <p className="text-xau-muted">Cumulative P&L begins at $0</p>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-xau-border bg-xau-card px-3 py-2 text-xs shadow-card">
      <p className="font-medium text-xau-ink">{point.label}</p>
      <p className="text-xau-muted">Cumulative: {formatUsd(point.equity)}</p>
      <p className={point.change >= 0 ? "text-tv-profit font-medium" : "text-tv-loss font-medium"}>
        Trade: {point.change >= 0 ? "+" : ""}
        {formatUsd(point.change)}
      </p>
    </div>
  );
}

export function EquityChart({
  equityCurve,
  className = "",
}: {
  equityCurve: EquityPoint[];
  className?: string;
}) {
  const palette = useChartPalette();
  const tradeCount = Math.max(0, equityCurve.length - 1);
  const equityMinWidth = Math.max(320, tradeCount * 52);

  if (tradeCount === 0) {
    return (
      <div className={`flex items-center justify-center rounded-2xl border border-xau-border bg-xau-card text-sm text-xau-muted ${className}`.trim()} style={{ minHeight: OVERVIEW_CHART_PLOT_HEIGHT + 120 }}>
        Log trades to see your equity curve.
      </div>
    );
  }

  return (
    <article className={`${overviewChartCardClass} ${className}`.trim()}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-xau-ink">Equity curve</h2>
          <p className="mt-0.5 text-xs text-xau-muted">Cumulative net P&L · scroll when you have many trades</p>
        </div>
        <span className="text-xs font-medium text-xau-muted">{tradeCount} trades</span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col">
      <ChartContainer className="min-h-0 w-full flex-1">
        <div className="w-full overflow-x-auto overflow-y-hidden pb-1" style={{ height: OVERVIEW_CHART_PLOT_HEIGHT }}>
          <div style={{ minWidth: equityMinWidth, height: OVERVIEW_CHART_PLOT_HEIGHT }}>
            <ResponsiveContainer width="100%" height={OVERVIEW_CHART_PLOT_HEIGHT}>
              <LineChart data={equityCurve} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
                    <CartesianGrid stroke={palette.grid} strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: palette.tick }}
                  interval={tradeCount > 14 ? Math.floor(tradeCount / 10) : 0}
                  angle={tradeCount > 8 ? -35 : 0}
                  textAnchor={tradeCount > 8 ? "end" : "middle"}
                  height={tradeCount > 8 ? 52 : 28}
                />
                <YAxis
                      tick={{ fontSize: 11, fill: palette.tick }}
                      tickFormatter={(v) => formatUsd(Number(v))}
                      width={72}
                    />
                    <Tooltip content={<EquityTooltip />} />
                    <ReferenceLine y={0} stroke={palette.zeroLine} strokeDasharray="4 4" />
                    <Line
                      type="monotone"
                      dataKey="equity"
                      stroke={palette.equityLine}
                      strokeWidth={2.5}
                      dot={{ r: tradeCount > 20 ? 2 : 4, fill: palette.equityDot, strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: palette.equityDot }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </ChartContainer>
      </div>
    </article>
  );
}
