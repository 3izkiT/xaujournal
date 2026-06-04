"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function FormCollapsible({ title, description, children, defaultOpen = false }: Props) {
  return (
    <details
      className="xau-form-section group rounded-2xl border border-xau-border bg-xau-card/60"
      open={defaultOpen || undefined}
    >
      <summary className="xau-btn-nav cursor-pointer list-none rounded-2xl px-4 py-4 marker:content-none transition [&::-webkit-details-marker]:hidden">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-medium text-xau-ink">{title}</h2>
            {description ? <p className="mt-1 text-xs leading-relaxed text-xau-muted">{description}</p> : null}
          </div>
          <span
            className="mt-0.5 shrink-0 text-xs text-xau-muted transition group-open:rotate-180"
            aria-hidden
          >
            ▼
          </span>
        </div>
      </summary>
      <div className="space-y-4 border-t border-xau-border px-4 pb-4 pt-4">{children}</div>
    </details>
  );
}
