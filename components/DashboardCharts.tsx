"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "@/components/ChartContainer";
import { XAU_CHART } from "@/lib/chart-colors";

type EquityPoint = {
  date: string;
  label: string;
  tradeIndex: number;
  equity: number;
  change: number;
};

type SetupRow = { setup: string; winRate: number; mistakes: number };

type Props = {
  equityCurve: EquityPoint[];
  setupVsMistakes: SetupRow[];
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
      <p className={point.change >= 0 ? "font-medium text-xau-profit" : "font-medium text-xau-loss"}>
        Trade: {point.change >= 0 ? "+" : ""}
        {formatUsd(point.change)}
      </p>
    </div>
  );
}

function SetupTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { dataKey: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const winRate = payload.find((p) => p.dataKey === "winRate")?.value ?? 0;
  const mistakes = payload.find((p) => p.dataKey === "mistakes")?.value ?? 0;
  return (
    <div className="rounded-xl border border-xau-border bg-xau-card px-3 py-2 text-xs shadow-card">
      <p className="font-medium text-xau-ink">{label}</p>
      <p className="font-medium text-xau-profit">Win rate: {winRate}%</p>
      <p className="font-medium text-xau-loss">Mistake trades: {mistakes}</p>
    </div>
  );
}

function ChartSectionHeader({
  title,
  subtitle,
  meta,
}: {
  title: string;
  subtitle: string;
  meta?: string;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div>
        <h3 className="text-lg font-medium text-xau-ink">{title}</h3>
        <p className="mt-1 text-sm text-xau-muted">{subtitle}</p>
      </div>
      {meta ? <p className="text-sm font-medium text-xau-ink">{meta}</p> : null}
    </div>
  );
}

export function DashboardCharts({ equityCurve, setupVsMistakes }: Props) {
  const tradeCount = Math.max(0, equityCurve.length - 1);
  const equityMinWidth = Math.max(320, tradeCount * 52);
  const setupCount = setupVsMistakes.length;
  const setupMinWidth = Math.max(320, setupCount * 120);
  const hasSetupData = setupVsMistakes.some((row) => row.winRate > 0 || row.mistakes > 0);

  return (
    <div className="space-y-4">
      {/* Tier 1: long-form trends — full width, horizontal scroll when dense */}
      <section className="xau-card-bordered p-4 md:p-5">
        <ChartSectionHeader
          title="Equity Curve"
          subtitle="Cumulative net P&L after each trade — scroll horizontally when you have many logs."
          meta={tradeCount > 0 ? `${tradeCount} trades logged` : undefined}
        />

        {tradeCount === 0 ? (
          <div className="flex h-48 items-center justify-center rounded-xl bg-xau-app text-sm text-xau-muted">
            Log trades to see your equity curve grow across time.
          </div>
        ) : (
          <ChartContainer className="h-56 sm:h-72 md:h-80 lg:h-96">
            <div className="h-full w-full overflow-x-auto overflow-y-hidden pb-1">
              <div className="h-full" style={{ minWidth: equityMinWidth }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={equityCurve} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
                    <CartesianGrid stroke={XAU_CHART.grid} strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: XAU_CHART.tick }}
                      interval={tradeCount > 14 ? Math.floor(tradeCount / 10) : 0}
                      angle={tradeCount > 8 ? -35 : 0}
                      textAnchor={tradeCount > 8 ? "end" : "middle"}
                      height={tradeCount > 8 ? 52 : 28}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: XAU_CHART.tick }}
                      tickFormatter={(v) => formatUsd(Number(v))}
                      width={72}
                    />
                    <Tooltip content={<EquityTooltip />} />
                    <ReferenceLine y={0} stroke={XAU_CHART.zeroLine} strokeDasharray="4 4" />
                    <Line
                      type="monotone"
                      dataKey="equity"
                      stroke={XAU_CHART.equityLine}
                      strokeWidth={2.5}
                      dot={{ r: tradeCount > 20 ? 2 : 4, fill: XAU_CHART.equityDot, strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: XAU_CHART.equityDot }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ChartContainer>
        )}
      </section>

      <section className="xau-card-bordered p-4 md:p-5">
        <ChartSectionHeader
          title="Setup Win Rate vs Mistakes"
          subtitle="Per setup tag — green is win rate %, pink is trades tagged with negative emotions."
          meta={setupCount > 0 ? `${setupCount} setups` : undefined}
        />

        {!hasSetupData ? (
          <div className="flex h-48 items-center justify-center rounded-xl bg-xau-app text-sm text-xau-muted">
            Tag setups on journal entries to compare edge and mistakes.
          </div>
        ) : (
          <ChartContainer className="h-56 sm:h-64 md:h-72">
            <div className="h-full w-full overflow-x-auto overflow-y-hidden pb-1">
              <div className="h-full" style={{ minWidth: setupMinWidth }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={setupVsMistakes} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
                    <CartesianGrid stroke={XAU_CHART.grid} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="setup" tick={{ fontSize: 11, fill: XAU_CHART.tick }} interval={0} />
                    <YAxis tick={{ fontSize: 11, fill: XAU_CHART.tick }} allowDecimals={false} width={40} />
                    <Tooltip content={<SetupTooltip />} />
                    <Legend
                      verticalAlign="top"
                      height={28}
                      formatter={(value) => (value === "winRate" ? "Win rate %" : "Mistakes")}
                    />
                    <Bar dataKey="winRate" name="winRate" fill={XAU_CHART.winRate} radius={[6, 6, 0, 0]} maxBarSize={48} />
                    <Bar dataKey="mistakes" name="mistakes" fill={XAU_CHART.mistakes} radius={[6, 6, 0, 0]} maxBarSize={48} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ChartContainer>
        )}
      </section>
    </div>
  );
}
