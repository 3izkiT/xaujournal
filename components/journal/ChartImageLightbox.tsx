"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChartImage } from "@/components/journal/ChartImage";

export type ChartSlide = {
  src: string;
  alt: string;
  caption?: string;
};

function isViewable(src: string) {
  return Boolean(src) && !src.startsWith("blob:");
}

type LightboxProps = {
  slides: ChartSlide[];
  startIndex?: number;
  onClose: () => void;
};

export function ChartImageLightbox({ slides, startIndex = 0, onClose }: LightboxProps) {
  const viewable = slides.filter((s) => isViewable(s.src));
  const [index, setIndex] = useState(() => Math.min(Math.max(0, startIndex), Math.max(0, viewable.length - 1)));
  const [mounted, setMounted] = useState(false);

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? viewable.length - 1 : i - 1));
  }, [viewable.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i >= viewable.length - 1 ? 0 : i + 1));
  }, [viewable.length]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, goPrev, goNext]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!mounted || viewable.length === 0) return null;

  const slide = viewable[index];
  const showNav = viewable.length > 1;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={slide.caption ?? slide.alt}
    >
      <button
        type="button"
        aria-label="Close image viewer"
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-full w-full max-w-6xl flex-col items-center gap-3">
        {slide.caption ? (
          <p className="relative z-10 text-center text-sm font-medium text-white/90">{slide.caption}</p>
        ) : null}
        <div className="relative z-10 flex max-h-[min(85vh,900px)] w-full items-center justify-center">
          {showNav ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-0 z-20 hidden rounded-full bg-black/50 px-3 py-6 text-white hover:bg-black/70 sm:block"
              aria-label="Previous image"
            >
              ‹
            </button>
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.src}
            alt={slide.alt}
            className="max-h-[min(85vh,900px)] max-w-full object-contain"
            draggable={false}
          />
          {showNav ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-0 z-20 hidden rounded-full bg-black/50 px-3 py-6 text-white hover:bg-black/70 sm:block"
              aria-label="Next image"
            >
              ›
            </button>
          ) : null}
        </div>
        {showNav ? (
          <p className="relative z-10 text-xs text-white/70">
            {index + 1} / {viewable.length} · arrow keys to browse
          </p>
        ) : null}
        <button
          type="button"
          onClick={onClose}
          className="relative z-10 rounded-full border border-white/30 bg-black/50 px-4 py-2 text-sm font-medium text-white hover:bg-black/70"
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  );
}

type ExpandableProps = {
  src: string;
  alt: string;
  caption?: string;
  fit?: "cover" | "contain";
  frameClassName?: string;
  slides?: ChartSlide[];
  slideIndex?: number;
};

export function ExpandableChartImage({
  src,
  alt,
  caption,
  fit = "contain",
  frameClassName = "relative flex min-h-[10rem] h-44 items-center justify-center overflow-hidden rounded-xl bg-xau-app",
  slides,
  slideIndex = 0,
}: ExpandableProps) {
  const [open, setOpen] = useState(false);
  const viewable = isViewable(src);
  const gallery =
    slides?.filter((s) => isViewable(s.src)) ??
    (viewable ? [{ src, alt, caption: caption ?? alt }] : []);

  const resolvedIndex = Math.min(
    Math.max(0, slideIndex),
    Math.max(0, gallery.findIndex((s) => s.src === src))
  );
  const indexInGallery = gallery.findIndex((s) => s.src === src);
  const startIndex = indexInGallery >= 0 ? indexInGallery : resolvedIndex;

  return (
    <>
      <button
        type="button"
        disabled={!viewable}
        onClick={() => viewable && setOpen(true)}
        className={`group w-full text-left ${viewable ? "cursor-zoom-in" : "cursor-default"}`}
        aria-label={viewable ? `Expand ${alt}` : alt}
      >
        <div className={frameClassName}>
          <ChartImage src={src} alt={alt} fit={fit} />
          {viewable ? (
            <span className="pointer-events-none absolute bottom-2 right-2 rounded-lg bg-black/65 px-2 py-1 text-[10px] font-medium text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
              Tap to expand
            </span>
          ) : null}
        </div>
      </button>
      {open && gallery.length > 0 ? (
        <ChartImageLightbox slides={gallery} startIndex={startIndex} onClose={() => setOpen(false)} />
      ) : null}
    </>
  );
}
