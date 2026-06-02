import { notFound } from "next/navigation";
import { isDatabaseConfigured } from "@/lib/db";
import { prisma } from "@/lib/db";
import { getTradesForUser } from "@/lib/trades-store";
import { getWinRate, getTotalPnl, getAverageDisciplineScore } from "@/lib/analytics";

export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  if (!isDatabaseConfigured) {
    return (
      <main className="mx-auto max-w-lg px-6 py-20 text-center text-slate-600">
        <p>Coach view is unavailable until the database is configured.</p>
      </main>
    );
  }

  const link = await prisma.shareLink.findUnique({ where: { token } });
  if (!link || (link.expiresAt && link.expiresAt < new Date())) {
    notFound();
  }

  const trades = await getTradesForUser(link.userId);
  const owner = await prisma.user.findUnique({
    where: { id: link.userId },
    select: { name: true },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="text-center">
          <p className="text-xs uppercase tracking-widest text-slate-400">Read-only coach view</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">{link.label}</h1>
          <p className="mt-2 text-sm text-slate-500">{owner?.name ?? "Trader"}&apos;s journal summary</p>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-center">
            <p className="text-xs text-slate-500">Win rate</p>
            <p className="text-2xl font-semibold">{getWinRate(trades)}%</p>
          </article>
          <article className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-center">
            <p className="text-xs text-slate-500">Discipline</p>
            <p className="text-2xl font-semibold">{getAverageDisciplineScore(trades)}%</p>
          </article>
          <article className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-center">
            <p className="text-xs text-slate-500">Net P&L</p>
            <p className="text-2xl font-semibold">${getTotalPnl(trades).toFixed(0)}</p>
          </article>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-medium">Recent trades ({trades.length})</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {trades.slice(0, 10).map((t) => (
              <li key={t.id} className="flex justify-between border-b border-slate-100 py-2">
                <span>
                  {t.date} · {t.type} · {t.disciplineScore}%
                </span>
                <span className={t.netProfitLoss >= 0 ? "text-emerald-700" : "text-rose-700"}>
                  ${t.netProfitLoss.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
