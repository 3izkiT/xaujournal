"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type SavingOverlayPhase = "saving" | "success";

type SavingOverlayProps = {
  open: boolean;
  phase?: SavingOverlayPhase;
  title?: string;
  subtitle?: string;
};

const DEFAULT_COPY: Record<SavingOverlayPhase, { title: string; subtitle: string }> = {
  saving: {
    title: "Saving your trade log",
    subtitle: "Writing discipline score, charts, and notes to your journal…",
  },
  success: {
    title: "Trade saved",
    subtitle: "Taking you to your history…",
  },
};

export function SavingOverlay({
  open,
  phase = "saving",
  title,
  subtitle,
}: SavingOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const copy = DEFAULT_COPY[phase];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-xau-ink/60 px-6 backdrop-blur-lg"
      role="alertdialog"
      aria-modal="true"
      aria-busy={phase === "saving"}
      aria-labelledby="saving-overlay-title"
      aria-describedby="saving-overlay-desc"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(212,175,55,0.12),transparent_70%)]"
        aria-hidden
      />
      {phase === "saving" && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1 overflow-hidden bg-xau-border/40"
          aria-hidden
        >
          <div className="h-full w-1/3 animate-saving-bar bg-gradient-to-r from-transparent via-xau-gold-accent to-transparent" />
        </div>
      )}

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center animate-rise-up">
        <div className="relative mb-8 flex h-28 w-28 items-center justify-center">
          {phase === "saving" ? (
            <>
              <span
                className="absolute inset-0 rounded-full border border-xau-border/80"
                aria-hidden
              />
              <span
                className="absolute inset-1 animate-spin rounded-full border-2 border-transparent border-t-xau-gold-accent border-r-xau-gold/40"
                aria-hidden
              />
              <span
                className="absolute inset-3 animate-pulse rounded-full bg-xau-gold/10"
                aria-hidden
              />
              <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-xau-gold to-xau-gold-accent text-lg font-bold tracking-tight text-xau-ink shadow-lg">
                Au
              </span>
            </>
          ) : (
            <span
              className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--xau-profit-bg)] text-3xl text-tv-profit shadow-inner"
              aria-hidden
            >
              ✓
            </span>
          )}
        </div>

        <h2 id="saving-overlay-title" className="text-xl font-semibold tracking-tight text-white">
          {title ?? copy.title}
        </h2>
        <p id="saving-overlay-desc" className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
          {subtitle ?? copy.subtitle}
        </p>

        {phase === "saving" && (
          <div className="mt-8 flex justify-center gap-2" aria-hidden>
            <span className="h-2 w-2 animate-bounce rounded-full bg-xau-gold-accent [animation-delay:0ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-xau-gold-accent [animation-delay:150ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-xau-gold-accent [animation-delay:300ms]" />
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
