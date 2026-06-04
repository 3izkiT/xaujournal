"use client";

import Link from "next/link";
import { ChartImage } from "@/components/journal/ChartImage";
import { useXauJournal } from "@/components/XauJournalContext";

export default function GalleryPage() {
  const { trades } = useXauJournal();

  return (
    <div className="xau-page-wide space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-xau-ink">Gallery View</h2>
        <p className="mt-2 text-sm text-xau-muted">Before/after charts — portrait or landscape screenshots from mobile or desktop.</p>
      </div>
      {trades.length === 0 ? (
        <p className="text-sm text-xau-muted">No trades with charts yet.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {trades.map((trade) => (
            <article key={trade.id} className="xau-card-bordered p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-xau-ink">
                  {trade.date} · {trade.type}
                </p>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/history?trade=${encodeURIComponent(trade.id)}`}
                    className="text-xs font-medium text-xau-gold-accent hover:underline"
                  >
                    Full log
                  </Link>
                  <span className="rounded-full bg-xau-calm px-3 py-1 text-xs text-xau-ink">{trade.session}</span>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs text-xau-muted">Before trade</p>
                  <div className="relative flex min-h-[10rem] max-h-[28rem] items-center justify-center overflow-hidden rounded-xl bg-xau-app">
                    <ChartImage src={trade.beforeChartUrl} alt="Before trade chart" fit="contain" />
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs text-xau-muted">After trade</p>
                  <div className="relative flex min-h-[10rem] max-h-[28rem] items-center justify-center overflow-hidden rounded-xl bg-xau-app">
                    <ChartImage src={trade.afterChartUrl} alt="After trade chart" fit="contain" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
