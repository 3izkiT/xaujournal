"use client";

import { ReactNode } from "react";

type Props = {
  badge?: "A" | "B" | "C";
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
};

export function JournalFormPanel({ badge, title, description, children, className = "" }: Props) {
  return (
    <section
      className={`space-y-4 rounded-2xl border border-xau-border bg-xau-card/80 p-5 shadow-sm ${className}`}
    >
      <div className="flex gap-3">
        {badge ? (
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-xau-gold bg-xau-gold-soft text-sm font-bold text-xau-ink"
            aria-hidden
          >
            {badge}
          </span>
        ) : null}
        <div className="min-w-0">
          <h2 className="text-lg font-medium text-xau-ink">{title}</h2>
          <p className="mt-1 text-xs leading-relaxed text-xau-muted">{description}</p>
          <p className="mt-1.5 text-xs font-medium text-xau-muted">Optional — fill only what you use</p>
        </div>
      </div>
      {children}
    </section>
  );
}
