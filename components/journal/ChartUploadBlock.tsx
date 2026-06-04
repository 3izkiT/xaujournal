"use client";

import { useId, useState } from "react";
import { ChartImage } from "@/components/journal/ChartImage";
import { HelpTooltip } from "@/components/ui/HelpTooltip";
import type { TooltipTerm } from "@/lib/term-tooltips";

type Props = {
  label: string;
  term: TooltipTerm;
  chartUrl: string;
  setChartUrl: (v: string) => void;
  onChartFile: (file: File | null, target: "before" | "after") => void;
  variant: "before" | "after";
};

function UploadIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="text-xau-gold-accent">
      <path
        d="M12 16V4m0 0L8 8m4-4 4 4M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChartUploadBlock({ label, term, chartUrl, setChartUrl, onChartFile, variant }: Props) {
  const inputId = useId();
  const [dragOver, setDragOver] = useState(false);

  const toneClass = variant === "before" ? "xau-chart-upload--before" : "xau-chart-upload--after";

  return (
    <div
      className={`xau-chart-upload ${toneClass} ${dragOver ? "xau-chart-upload--drag" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        onChartFile(e.dataTransfer.files?.[0] || null, variant);
      }}
    >
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-xau-ink">
        {label}
        <HelpTooltip term={term} label={`About ${label.toLowerCase()}`} size="sm" placement="above" />
      </span>

      <label htmlFor={inputId} className="xau-chart-upload-btn">
        <UploadIcon />
        <span className="text-sm font-semibold text-xau-ink">Upload screenshot</span>
        <span className="text-xs text-xau-muted">Tap to choose · or drag image onto this box</span>
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => onChartFile(e.target.files?.[0] || null, variant)}
      />

      <div className="relative">
        <span className="pointer-events-none absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 bg-xau-card px-2 text-[10px] font-medium uppercase tracking-wide text-xau-muted">
          or
        </span>
        <div className="border-t border-xau-border" aria-hidden />
      </div>

      <input
        className="xau-field text-xs"
        placeholder="Paste image URL (https://…)"
        value={chartUrl.startsWith("data:") ? "" : chartUrl}
        onChange={(e) => setChartUrl(e.target.value)}
        aria-label={`${label} image URL`}
      />

      {chartUrl ? (
        <div className="relative flex min-h-[10rem] max-h-[26rem] items-center justify-center overflow-hidden rounded-xl border border-xau-border bg-xau-app">
          <ChartImage src={chartUrl} alt={`${label} preview`} fit="contain" />
        </div>
      ) : (
        <p className="text-center text-[11px] text-xau-muted">No image yet — upload or paste a link above.</p>
      )}
    </div>
  );
}
