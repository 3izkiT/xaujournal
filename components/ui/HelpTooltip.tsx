"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { getTooltipText, type TooltipTerm } from "@/lib/term-tooltips";

type HelpTooltipProps = {
  term: TooltipTerm;
  /** Accessible name for the trigger (defaults to "Help"). */
  label?: string;
  className?: string;
  size?: "sm" | "md";
  /** Flip tooltip above the trigger when near bottom of viewport. */
  placement?: "above" | "below";
};

export function HelpTooltip({
  term,
  label = "Help",
  className = "",
  size = "md",
  placement = "below",
}: HelpTooltipProps) {
  const id = useId();
  const rootRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const text = getTooltipText(term);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const iconClass =
    size === "sm"
      ? "h-4 w-4 text-[10px]"
      : "h-5 w-5 text-xs";

  const positionClass =
    placement === "above"
      ? "bottom-full mb-1.5"
      : "top-full mt-1.5";

  return (
    <span ref={rootRef} className={`relative inline-flex align-middle ${className}`}>
      <button
        type="button"
        className={`inline-flex shrink-0 items-center justify-center rounded-full border border-xau-border bg-xau-card font-semibold text-xau-muted transition hover:border-xau-gold-accent/50 hover:text-xau-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-xau-gold-soft ${iconClass}`}
        aria-label={`${label}: ${text}`}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onClick={() => setOpen((prev) => !prev)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={(event) => {
          if (!rootRef.current?.contains(event.relatedTarget as Node)) setOpen(false);
        }}
      >
        ?
      </button>
      {open ? (
        <span
          id={id}
          role="tooltip"
          className={`pointer-events-none absolute left-1/2 z-50 w-[min(16rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg border border-xau-border bg-xau-card px-3 py-2 text-left text-xs font-normal normal-case leading-snug tracking-normal text-xau-ink shadow-lg sm:w-64 ${positionClass}`}
        >
          {text}
        </span>
      ) : null}
    </span>
  );
}

type PanelHeadingProps = {
  title: string;
  term?: TooltipTerm;
  description?: string;
  as?: "h2" | "h3" | "h4";
  className?: string;
};

export function PanelHeading({ title, term, description, as: Tag = "h2", className = "" }: PanelHeadingProps) {
  const sizeClass =
    Tag === "h2"
      ? "text-base font-semibold md:text-lg"
      : Tag === "h3"
        ? "text-sm font-semibold"
        : "text-sm font-medium";

  return (
    <div className={className}>
      <Tag className={`inline-flex items-center gap-1.5 text-xau-ink ${sizeClass}`}>
        {title}
        {term ? <HelpTooltip term={term} label={`About ${title}`} size="sm" placement="above" /> : null}
      </Tag>
      {description ? <p className="mt-0.5 text-xs text-xau-muted">{description}</p> : null}
    </div>
  );
}

type ThWithTooltipProps = {
  children: ReactNode;
  term: TooltipTerm;
  className?: string;
};

export function ThWithTooltip({ children, term, className = "" }: ThWithTooltipProps) {
  return (
    <th className={className}>
      <span className="inline-flex items-center justify-center gap-0.5">
        {children}
        <HelpTooltip term={term} size="sm" placement="above" />
      </span>
    </th>
  );
}
