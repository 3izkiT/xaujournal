"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "@/components/ChartContainer";

const pieColors = ["#93c5fd", "#86efac", "#fde68a"];

type Props = {
  equityCurve: { date: string; equity: number }[];
  sessionData: { name: string; value: number }[];
  setupVsMistakes: { setup: string; winRate: number; mistakes: number }[];
};

export function DashboardCharts({ equityCurve, sessionData, setupVsMistakes }: Props) {
  return (
    <>
      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 p-5">
          <h3 className="mb-4 text-lg font-medium text-slate-900">Equity Curve</h3>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={equityCurve}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line dataKey="equity" stroke="#60a5fa" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </article>

        <article className="rounded-2xl border border-slate-200 p-5">
          <h3 className="mb-4 text-lg font-medium text-slate-900">Session Performance (P&L)</h3>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionData}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
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
      </section>

      <section className="rounded-2xl border border-slate-200 p-5">
        <h3 className="mb-4 text-lg font-medium text-slate-900">Setup Win Rate vs Emotional Mistakes</h3>
        <ChartContainer className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={setupVsMistakes}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="setup" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="winRate" fill="#86efac" radius={[8, 8, 0, 0]} />
              <Bar dataKey="mistakes" fill="#f9a8d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </section>
    </>
  );
}
