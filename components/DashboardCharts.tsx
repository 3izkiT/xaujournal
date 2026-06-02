"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "@/components/ChartContainer";

const pieColors = ["#93c5fd", "#86efac", "#fde68a"];

type EquityPoint = {
  date: string;
  label: string;
  tradeIndex: number;
  equity: number;
  change: number;
};

type Props = {
  equityCurve: EquityPoint[];
  sessionData: { name: string; value: number }[];
  setupVsMistakes: { setup: string; winRate: number; mistakes: number }[];
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
      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
        <p className="font-medium text-slate-800">Starting balance</p>
        <p className="text-slate-500">Cumulative P&L begins at $0</p>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-slate-800">{point.label}</p>
      <p className="text-slate-600">Cumulative: {formatUsd(point.equity)}</p>
      <p className={point.change >= 0 ? "text-emerald-600" : "text-rose-600"}>
        Trade: {point.change >= 0 ? "+" : ""}
        {formatUsd(point.change)}
      </p>
    </div>
  );
}

export function DashboardCharts({ equityCurve, sessionData, setupVsMistakes }: Props) {
  const tradeCount = Math.max(0, equityCurve.length - 1);
  const chartMinWidth = Math.max(320, tradeCount * 52);

  return (
    <>
      {/* Full-width equity — cumulative net P&L should read as a long horizontal trend */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 className="text-lg font-medium text-slate-900">Equity Curve</h3>
            <p className="mt-1 text-sm text-slate-500">
              Cumulative net P&L after each trade — scroll horizontally when you have many logs.
            </p>
          </div>
          {tradeCount > 0 && (
            <p className="text-sm font-medium text-slate-700">{tradeCount} trades logged</p>
          )}
        </div>

        {tradeCount === 0 ? (
          <div className="flex h-48 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
            Log trades to see your equity curve grow across time.
          </div>
        ) : (
          <ChartContainer className="h-56 sm:h-72 md:h-80 lg:h-96">
            <div className="h-full w-full overflow-x-auto overflow-y-hidden pb-1">
              <div className="h-full" style={{ minWidth: chartMinWidth }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={equityCurve} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
                    <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      interval={tradeCount > 14 ? Math.floor(tradeCount / 10) : 0}
                      angle={tradeCount > 8 ? -35 : 0}
                      textAnchor={tradeCount > 8 ? "end" : "middle"}
                      height={tradeCount > 8 ? 52 : 28}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      tickFormatter={(v) => formatUsd(Number(v))}
                      width={72}
                    />
                    <Tooltip content={<EquityTooltip />} />
                    <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" />
                    <Line
                      type="monotone"
                      dataKey="equity"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      dot={{ r: tradeCount > 20 ? 2 : 4, fill: "#3b82f6", strokeWidth: 0 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ChartContainer>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 p-5">
          <h3 className="mb-4 text-lg font-medium text-slate-900">Session Performance (P&L)</h3>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionData}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => formatUsd(Number(v))} width={72} />
                <Tooltip formatter={(value) => formatUsd(Number(value ?? 0))} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {sessionData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={entry.value >= 0 ? pieColors[index % pieColors.length] : "#f9a8d4"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </article>

        <article className="rounded-2xl border border-slate-200 p-5">
          <h3 className="mb-1 text-lg font-medium text-slate-900">Setup Win Rate vs Mistakes</h3>
          <p className="mb-4 text-xs text-slate-500">Per setup tag</p>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={setupVsMistakes}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="setup" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="winRate" fill="#86efac" radius={[8, 8, 0, 0]} />
                <Bar dataKey="mistakes" fill="#f9a8d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </article>
      </section>
    </>
  );
}
