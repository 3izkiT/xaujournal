"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer } from "@/components/ChartContainer";
import { sessionChartSubtitle } from "@/lib/sessions";
import { OVERVIEW_CHART_PLOT_HEIGHT, overviewChartCardClass } from "@/lib/dashboard-charts";
import { useChartPalette } from "@/lib/use-chart-palette";

type SessionRow = { name: string; value: number };

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function SessionMini({ sessionData, className = "" }: { sessionData: SessionRow[]; className?: string }) {
  const palette = useChartPalette();
  const hasData = sessionData.some((s) => s.value !== 0);

  return (
    <article className={`${overviewChartCardClass} ${className}`.trim()}>
      <div className="mb-4 min-h-[3.75rem]">
        <h2 className="text-base font-semibold text-xau-ink">Session P&L</h2>
        <p className="mt-0.5 text-xs text-xau-muted">{sessionChartSubtitle()}</p>
      </div>
      {!hasData ? (
        <p className="mt-6 flex flex-1 items-center justify-center text-center text-xs text-xau-muted">
          Tag sessions on entries.
        </p>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
        <ChartContainer className="min-h-0 w-full flex-1">
          <ResponsiveContainer width="100%" height={OVERVIEW_CHART_PLOT_HEIGHT}>
            <BarChart data={sessionData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={palette.grid} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: palette.tick }} />
              <YAxis tickFormatter={(v) => formatUsd(Number(v))} width={52} tick={{ fontSize: 9, fill: palette.tick }} />
              <Tooltip formatter={(value) => formatUsd(Number(value ?? 0))} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={40}>
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
        </div>
      )}
    </article>
  );
}
