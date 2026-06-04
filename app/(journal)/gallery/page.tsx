"use client";

import Link from "next/link";
import { ExpandableChartImage, type ChartSlide } from "@/components/journal/ChartImageLightbox";
import type { JournalTrade } from "@/lib/types";
import { useXauJournal } from "@/components/XauJournalContext";


function GalleryCharts({ trade }: { trade: JournalTrade }) {
  const slides: ChartSlide[] = [
    { src: trade.beforeChartUrl, alt: "Before trade chart", caption: `${trade.date} · before` },
    { src: trade.afterChartUrl, alt: "After trade chart", caption: `${trade.date} · after` },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <p className="mb-2 text-xs text-xau-muted">Before trade</p>
        <ExpandableChartImage
          src={trade.beforeChartUrl}
          alt="Before trade chart"
          fit="contain"
          frameClassName="relative flex min-h-[10rem] max-h-[28rem] items-center justify-center overflow-hidden rounded-xl bg-xau-app"
          slides={slides}
          slideIndex={0}
        />
      </div>
      <div>
        <p className="mb-2 text-xs text-xau-muted">After trade</p>
        <ExpandableChartImage
          src={trade.afterChartUrl}
          alt="After trade chart"
          fit="contain"
          frameClassName="relative flex min-h-[10rem] max-h-[28rem] items-center justify-center overflow-hidden rounded-xl bg-xau-app"
          slides={slides}
          slideIndex={1}
        />
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const { trades } = useXauJournal();

  return (
    <div className="xau-page-wide space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-xau-gold-accent">Chart study</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Gallery</h1>
        <p className="mt-1 text-sm text-xau-muted">
          Before/after screenshots from mobile or desktop — tap any image to expand.
        </p>
      </header>
      {trades.length === 0 ? (
        <div className="xau-card-bordered px-6 py-12 text-center text-sm text-xau-muted">
          No trades with charts yet.{" "}
          <Link href="/journal-entry" className="font-medium text-xau-ink underline-offset-2 hover:underline">
            Log your first trade
          </Link>
        </div>
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
              <GalleryCharts trade={trade} />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
