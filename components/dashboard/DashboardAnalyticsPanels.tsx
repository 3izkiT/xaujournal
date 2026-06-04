"use client";

import dynamic from "next/dynamic";
const SetupAnalytics = dynamic(
  () => import("@/components/dashboard/SetupAnalytics").then((m) => m.SetupAnalytics),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-2xl bg-xau-card" /> }
);

const ExecutionAnalytics = dynamic(
  () => import("@/components/dashboard/ExecutionAnalytics").then((m) => m.ExecutionAnalytics),
  { ssr: false, loading: () => <div className="h-48 animate-pulse rounded-2xl bg-xau-card" /> }
);

const DisciplineAnalytics = dynamic(
  () => import("@/components/dashboard/DisciplineAnalytics").then((m) => m.DisciplineAnalytics),
  { ssr: false, loading: () => <div className="h-48 animate-pulse rounded-2xl bg-xau-card" /> }
);

type SessionRow = { name: string; value: number };

type Props = {
  setupVsMistakes: ReturnType<typeof import("@/lib/analytics").getSetupWinRateVsMistakes>;
  sessionData: SessionRow[];
  avgHoldMinutes: number | null;
  avgMae: number | null;
  avgMfe: number | null;
  ruleBreaks: { label: string; count: number }[];
  heatmap: ReturnType<typeof import("@/lib/analytics").getDayHourHeatmap>;
};

export function DashboardAnalyticsPanels({
  setupVsMistakes,
  sessionData,
  avgHoldMinutes,
  avgMae,
  avgMfe,
  ruleBreaks,
  heatmap,
}: Props) {
  return (
    <div className="space-y-6">
      <SetupAnalytics setupVsMistakes={setupVsMistakes} />
      <ExecutionAnalytics
        sessionData={sessionData}
        avgHoldMinutes={avgHoldMinutes}
        avgMae={avgMae}
        avgMfe={avgMfe}
      />
      <DisciplineAnalytics ruleBreaks={ruleBreaks} heatmap={heatmap} />
    </div>
  );
}
