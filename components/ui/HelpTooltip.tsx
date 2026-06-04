"use client";

import { type ReactNode, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getTooltipText, type TooltipTerm } from "@/lib/term-tooltips";

const TOOLTIP_MAX_WIDTH = 256;
const VIEWPORT_PAD = 8;
const GAP = 8;

type HelpTooltipProps = {
  term: TooltipTerm;
  label?: string;
  className?: string;
  size?: "sm" | "md";
  placement?: "above" | "below";
};

type TooltipCoords = {
  top: number;
  left: number;
  placement: "above" | "below";
};

function computeCoords(button: HTMLButtonElement, placement: "above" | "below"): TooltipCoords {
  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  let left = centerX - TOOLTIP_MAX_WIDTH / 2;
  left = Math.max(VIEWPORT_PAD, Math.min(left, window.innerWidth - TOOLTIP_MAX_WIDTH - VIEWPORT_PAD));

  if (placement === "above") {
    return { top: rect.top - GAP, left, placement: "above" };
  }
  return { top: rect.bottom + GAP, left, placement: "below" };
}

export function HelpTooltip({
  term,
  label = "Help",
  className = "",
  size = "md",
  placement = "below",
}: HelpTooltipProps) {
  const id = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<TooltipCoords | null>(null);
  const text = getTooltipText(term);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) {
      setCoords(null);
      return;
    }

    const update = () => {
      if (buttonRef.current) setCoords(computeCoords(buttonRef.current, placement));
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, placement]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target)) return;
      const portal = document.getElementById(id);
      if (portal?.contains(target)) return;
      setOpen(false);
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
  }, [open, id]);

  const iconClass = size === "sm" ? "h-4 w-4 text-[10px]" : "h-5 w-5 text-xs";

  const tooltipBubble =
    open && mounted && coords
      ? createPortal(
          <span
            id={id}
            role="tooltip"
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              width: TOOLTIP_MAX_WIDTH,
              maxWidth: `calc(100vw - ${VIEWPORT_PAD * 2}px)`,
              transform: coords.placement === "above" ? "translateY(-100%)" : undefined,
              zIndex: 10000,
            }}
            className="rounded-lg border border-xau-border bg-xau-card px-3 py-2 text-left text-xs font-normal normal-case leading-snug tracking-normal text-xau-ink shadow-lg"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            {text}
          </span>,
          document.body
        )
      : null;

  return (
    <>
      <span className={`inline-flex align-middle ${className}`}>
        <button
          ref={buttonRef}
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
            const related = event.relatedTarget as Node | null;
            const portal = document.getElementById(id);
            if (portal?.contains(related)) return;
            setOpen(false);
          }}
        >
          ?
        </button>
      </span>
      {tooltipBubble}
    </>
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
    <th className={`overflow-visible ${className}`}>
      <span className="inline-flex items-center justify-center gap-0.5 whitespace-nowrap">
        {children}
        <HelpTooltip term={term} size="sm" placement="above" />
      </span>
    </th>
  );
}
