import { notFound } from "next/navigation";
import { isDatabaseConfigured } from "@/lib/db";
import { prisma } from "@/lib/db";
import { getTradesForUser } from "@/lib/trades-store";
import { getWinRate, getTotalPnl, getAverageDisciplineScore } from "@/lib/analytics";

export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  if (!isDatabaseConfigured) {
    return (
      <main className="mx-auto max-w-lg px-6 py-20 text-center text-xau-muted">
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
    <main className="min-h-screen bg-xau-app px-6 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="text-center">
          <p className="text-xs uppercase tracking-widest text-xau-gold-accent">Read-only coach view</p>
          <h1 className="mt-2 text-3xl font-semibold text-xau-ink">{link.label}</h1>
          <p className="mt-2 text-sm text-xau-muted">{owner?.name ?? "Trader"}&apos;s journal summary</p>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <article className="xau-kpi-profit p-4 text-center">
            <p className="text-xs text-xau-muted">Win rate</p>
            <p className="text-2xl font-semibold text-xau-ink">{getWinRate(trades)}%</p>
          </article>
          <article className="xau-kpi-calm p-4 text-center">
            <p className="text-xs text-xau-muted">Discipline</p>
            <p className="text-2xl font-semibold text-xau-ink">{getAverageDisciplineScore(trades)}%</p>
          </article>
          <article className="xau-kpi-gold p-4 text-center">
            <p className="text-xs text-xau-muted">Net P&L</p>
            <p className="text-2xl font-semibold text-xau-ink">${getTotalPnl(trades).toFixed(0)}</p>
          </article>
        </section>

        <section className="xau-card-bordered p-5">
          <h2 className="text-lg font-medium text-xau-ink">Recent trades ({trades.length})</h2>
          <ul className="mt-4 space-y-2 text-sm text-xau-muted">
            {trades.slice(0, 10).map((t) => (
              <li key={t.id} className="flex justify-between border-b border-xau-border py-2">
                <span>
                  {t.date} · {t.type} · {t.disciplineScore}%
                </span>
                <span className={`font-medium ${t.netProfitLoss >= 0 ? "text-tv-profit" : "text-tv-loss"}`}>
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
