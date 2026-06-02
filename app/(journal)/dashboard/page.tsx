"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useXauJournal } from "@/components/XauJournalContext";
import {
  getAverageDisciplineScore,
  getEquityCurve,
  getSessionPerformance,
  getSetupWinRateVsMistakes,
  getTotalPnl,
  getWinRate,
} from "@/lib/analytics";

const pieColors = ["#93c5fd", "#86efac", "#fde68a"];

function cardTone(type: "mint" | "blue" | "pink") {
  if (type === "mint") return "border-emerald-100 bg-emerald-50";
  if (type === "pink") return "border-rose-100 bg-rose-50";
  return "border-sky-100 bg-sky-50";
}

export default function DashboardPage() {
  const { trades } = useXauJournal();
  const winRate = getWinRate(trades);
  const avgDiscipline = getAverageDisciplineScore(trades);
  const totalPnl = getTotalPnl(trades);
  const equityCurve = getEquityCurve(trades);
  const sessionData = getSessionPerformance(trades);
  const setupVsMistakes = getSetupWinRateVsMistakes(trades);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold text-slate-900">Dashboard Overview</h2>
        <p className="mt-2 text-sm text-slate-500">High-level performance and discipline insights for XAUUSD only.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <article className={`rounded-2xl border p-5 ${cardTone("mint")}`}>
          <p className="text-sm text-slate-500">Win Rate</p>
          <p className="mt-2 text-3xl font-semibold text-slate-800">{winRate}%</p>
        </article>
        <article className={`rounded-2xl border p-5 ${cardTone("blue")}`}>
          <p className="text-sm text-slate-500">Average Discipline Score</p>
          <p className="mt-2 text-3xl font-semibold text-slate-800">{avgDiscipline}%</p>
        </article>
        <article className={`rounded-2xl border p-5 ${cardTone(totalPnl >= 0 ? "mint" : "pink")}`}>
          <p className="text-sm text-slate-500">Total Net P&L</p>
          <p className="mt-2 text-3xl font-semibold text-slate-800">${totalPnl.toFixed(2)}</p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 p-5">
          <h3 className="mb-4 text-lg font-medium text-slate-900">Equity Curve</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={equityCurve}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line dataKey="equity" stroke="#60a5fa" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 p-5">
          <h3 className="mb-4 text-lg font-medium text-slate-900">Session Performance</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sessionData} dataKey="value" nameKey="name" outerRadius={100} fill="#93c5fd" label>
                  {sessionData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 p-5">
        <h3 className="mb-4 text-lg font-medium text-slate-900">Setup Win Rate vs Emotional Mistakes</h3>
        <div className="h-80">
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
        </div>
      </section>
    </div>
  );
}
