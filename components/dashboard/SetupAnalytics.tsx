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
import { PanelHeading } from "@/components/ui/HelpTooltip";
import { useMdUp } from "@/lib/use-md-up";
import { useChartPalette } from "@/lib/use-chart-palette";

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
      <p className="text-tv-profit font-medium">Win rate: {winRate}%</p>
      <p className="text-tv-loss font-medium">Mistake trades: {mistakes}</p>
    </div>
  );
}

export function SetupAnalytics({ setupVsMistakes }: { setupVsMistakes: SetupRow[] }) {
  const palette = useChartPalette();
  const mdUp = useMdUp();
  const setupCount = setupVsMistakes.length;
  const setupMinWidth = Math.max(320, setupCount * 120);
  const chartScroll = mdUp && setupCount > 3;
  const hasSetupData = setupVsMistakes.some((row) => row.winRate > 0 || row.mistakes > 0);

  return (
    <article className="xau-card-bordered p-4 md:p-5">
      <PanelHeading
        as="h2"
        className="mb-4"
        title="Setup win rate vs mistakes"
        term="setupWinRate"
        description="Per setup tag on journal entries"
      />
      {!hasSetupData ? (
        <div className="flex h-48 items-center justify-center rounded-xl bg-xau-app text-sm text-xau-muted">
          Tag setups to compare edge and mistakes.
        </div>
      ) : (
        <ChartContainer className="w-full">
          <div className={`h-full w-full overflow-y-hidden pb-1 ${chartScroll ? "overflow-x-auto" : "overflow-x-hidden"}`}>
            <div className="h-full min-w-0 w-full" style={chartScroll ? { minWidth: setupMinWidth } : undefined}>
              <ResponsiveContainer width="100%" height={288}>
                <BarChart data={setupVsMistakes} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
                    <CartesianGrid stroke={palette.grid} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="setup" tick={{ fontSize: 11, fill: palette.tick }} interval={0} />
                    <YAxis tick={{ fontSize: 11, fill: palette.tick }} allowDecimals={false} width={40} />
                    <Tooltip content={<SetupTooltip />} />
                    <Legend
                      verticalAlign="top"
                      height={28}
                      formatter={(value) => (value === "winRate" ? "Win rate %" : "Mistakes")}
                    />
                    <Bar dataKey="winRate" name="winRate" fill={palette.winRate} radius={[6, 6, 0, 0]} maxBarSize={48} />
                    <Bar dataKey="mistakes" name="mistakes" fill={palette.mistakes} radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartContainer>
      )}
    </article>
  );
}
