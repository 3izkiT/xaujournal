"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "@/components/ChartContainer";
import { XAU_CHART } from "@/lib/chart-colors";

type SetupRow = { setup: string; winRate: number; mistakes: number };

function SetupTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { dataKey: string; value: number }[];
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

export function SetupAnalytics({ setupVsMistakes }: { setupVsMistakes: SetupRow[] }) {
  const setupCount = setupVsMistakes.length;
  const setupMinWidth = Math.max(320, setupCount * 120);
  const hasSetupData = setupVsMistakes.some((row) => row.winRate > 0 || row.mistakes > 0);

  return (
    <article className="xau-card-bordered p-4 md:p-5">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-xau-ink">Setup win rate vs mistakes</h2>
        <p className="mt-0.5 text-xs text-xau-muted">Per setup tag on journal entries</p>
      </div>
      {!hasSetupData ? (
        <div className="flex h-48 items-center justify-center rounded-xl bg-xau-app text-sm text-xau-muted">
          Tag setups to compare edge and mistakes.
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
    </article>
  );
}
