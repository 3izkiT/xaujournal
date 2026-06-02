"use client";

import Image from "next/image";
import { useXauJournal } from "@/components/XauJournalContext";

export default function GalleryPage() {
  const { trades } = useXauJournal();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-xau-ink">Gallery View</h2>
        <p className="mt-2 text-sm text-xau-muted">Before/after chart study board for pattern review and discipline feedback.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {trades.map((trade) => (
          <article key={trade.id} className="rounded-2xl border border-xau-border p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-medium text-xau-ink">
                {trade.date} · {trade.type}
              </p>
              <span className="rounded-full bg-xau-calm px-3 py-1 text-xs text-xau-ink">{trade.session}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs text-xau-muted">Before Trade</p>
                <div className="relative h-40 overflow-hidden rounded-xl bg-xau-app">
                  <Image src={trade.beforeChartUrl} alt="Before trade chart" fill className="object-cover" unoptimized={trade.beforeChartUrl.startsWith("blob:")} />
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs text-xau-muted">After Trade</p>
                <div className="relative h-40 overflow-hidden rounded-xl bg-xau-app">
                  <Image src={trade.afterChartUrl} alt="After trade chart" fill className="object-cover" unoptimized={trade.afterChartUrl.startsWith("blob:")} />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
