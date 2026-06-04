"use client";

import Link from "next/link";
import { PanelHeading, ThWithTooltip } from "@/components/ui/HelpTooltip";
import type { JournalTrade } from "@/lib/types";

function shortSession(session: JournalTrade["session"]) {
  return session.replace(" Session", "");
}

function primarySetup(trade: JournalTrade) {
  return trade.setupTags[0] ?? null;
}

type Props = {
  trades: JournalTrade[];
  maxItems?: number;
};

export function RecentTradesPanel({ trades, maxItems = 5 }: Props) {
  const recent = [...trades]
    .sort((a, b) => b.date.localeCompare(a.date) || (b.entryAt ?? "").localeCompare(a.entryAt ?? ""))
    .slice(0, maxItems);

  return (
    <article className="xau-card-bordered flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-xau-border px-4 py-3">
        <PanelHeading as="h2" title="Recent trades" term="recentTrades" className="min-w-0" />
        <Link href="/history" className="shrink-0 text-xs font-medium text-xau-muted hover:text-xau-ink">
          View all →
        </Link>
      </div>

      {recent.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-xau-muted">No trades logged yet.</p>
      ) : (
        <>
          <ul className="divide-y divide-xau-border md:hidden">
            {recent.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/history?trade=${encodeURIComponent(t.id)}`}
                  className="block px-4 py-3 transition hover:bg-xau-app/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-xau-ink">{t.date}</p>
                      <p className="mt-0.5 text-xs text-xau-muted">
                        <span className={t.type === "Buy" ? "text-tv-profit" : "text-tv-loss"}>{t.type}</span>
                        {" · "}
                        {shortSession(t.session)}
                        {t.rMultiple ? ` · ${t.rMultiple}` : ""}
                      </p>
                    </div>
                    <p
                      className={`shrink-0 text-sm font-semibold ${t.netProfitLoss >= 0 ? "text-tv-profit" : "text-tv-loss"}`}
                    >
                      {t.netProfitLoss >= 0 ? "+" : "-"}${Math.abs(t.netProfitLoss).toFixed(2)}
                    </p>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-xau-muted">
                    <span>{t.disciplineScore}% discipline</span>
                    <span>·</span>
                    <span>{t.emotion}</span>
                    {primarySetup(t) ? (
                      <>
                        <span>·</span>
                        <span className="truncate">{primarySetup(t)}</span>
                      </>
                    ) : null}
                    {t.holdTimeMinutes != null ? (
                      <>
                        <span>·</span>
                        <span>{t.holdTimeMinutes}m hold</span>
                      </>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden min-h-0 flex-1 md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="border-b border-xau-border bg-xau-app/80 text-[11px] uppercase tracking-wide text-xau-muted">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Date</th>
                    <th className="px-3 py-2.5 font-medium">Type</th>
                    <ThWithTooltip term="session" className="px-3 py-2.5 font-medium">Session</ThWithTooltip>
                    <ThWithTooltip term="rMultiple" className="px-3 py-2.5 font-medium">R</ThWithTooltip>
                    <ThWithTooltip term="netShort" className="px-3 py-2.5 font-medium">Net</ThWithTooltip>
                    <ThWithTooltip term="disciplineShort" className="px-3 py-2.5 font-medium">Disc.</ThWithTooltip>
                    <ThWithTooltip term="emotion" className="hidden px-3 py-2.5 font-medium lg:table-cell">Emotion</ThWithTooltip>
                    <ThWithTooltip term="setup" className="hidden px-3 py-2.5 font-medium xl:table-cell">Setup</ThWithTooltip>
                  </tr>
                </thead>
                <tbody className="divide-y divide-xau-border">
                  {recent.map((t) => (
                    <tr key={t.id} className="text-xau-ink transition hover:bg-xau-app/50">
                      <td className="whitespace-nowrap px-4 py-2.5">
                        <Link
                          href={`/history?trade=${encodeURIComponent(t.id)}`}
                          className="font-medium hover:text-xau-gold-accent hover:underline"
                        >
                          {t.date}
                        </Link>
                      </td>
                      <td className={`px-3 py-2.5 font-medium ${t.type === "Buy" ? "text-tv-profit" : "text-tv-loss"}`}>
                        {t.type}
                      </td>
                      <td className="px-3 py-2.5 text-xau-muted">{shortSession(t.session)}</td>
                      <td className="px-3 py-2.5 text-xau-muted">{t.rMultiple || "—"}</td>
                      <td
                        className={`px-3 py-2.5 font-semibold ${t.netProfitLoss >= 0 ? "text-tv-profit" : "text-tv-loss"}`}
                      >
                        {t.netProfitLoss >= 0 ? "+" : "-"}${Math.abs(t.netProfitLoss).toFixed(2)}
                      </td>
                      <td className="px-3 py-2.5">{t.disciplineScore}%</td>
                      <td className="hidden px-3 py-2.5 text-xau-muted lg:table-cell">{t.emotion}</td>
                      <td className="hidden max-w-[140px] truncate px-3 py-2.5 text-xau-muted xl:table-cell" title={primarySetup(t) ?? undefined}>
                        {primarySetup(t) ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </article>
  );
}
