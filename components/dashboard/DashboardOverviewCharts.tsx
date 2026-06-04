"use client";

import { EquityChart, type EquityPoint } from "@/components/dashboard/EquityChart";
import { SessionMini } from "@/components/dashboard/SessionMini";

type SessionRow = { name: string; value: number };

type Props = {
  equityCurve: EquityPoint[];
  sessionData: SessionRow[];
};

export function DashboardOverviewCharts({ equityCurve, sessionData }: Props) {
  return (
    <>
      <div className="h-full lg:col-span-8">
        <EquityChart equityCurve={equityCurve} />
      </div>
      <aside className="h-full lg:col-span-4">
        <SessionMini sessionData={sessionData} />
      </aside>
    </>
  );
}

export function DashboardOverviewChartsSkeleton() {
  return (
    <>
      <div
        className="h-64 animate-pulse rounded-2xl bg-xau-card md:h-80 lg:col-span-8"
        aria-hidden
      />
      <div
        className="h-64 animate-pulse rounded-2xl bg-xau-card md:h-80 lg:col-span-4"
        aria-hidden
      />
    </>
  );
}
