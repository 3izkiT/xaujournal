"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

const LOCALE_META: Record<AppLocale, { flag: string; label: string }> = {
  en: { flag: "🇺🇸", label: "English" },
  th: { flag: "🇹🇭", label: "ไทย" },
};

type LanguageSwitcherProps = {
  className?: string;
  /** Open menu above the button (e.g. sidebar footer on mobile). */
  menuPlacement?: "below" | "above";
};

export function LanguageSwitcher({
  className = "",
  menuPlacement = "below",
}: LanguageSwitcherProps) {
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const setLocale = (next: AppLocale) => {
    if (next === locale) {
      setOpen(false);
      return;
    }
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;SameSite=Lax`;
    setOpen(false);
    router.refresh();
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const current = LOCALE_META[locale];
  const others = routing.locales.filter((code) => code !== locale) as AppLocale[];

  const menuPosition =
    menuPlacement === "above"
      ? "bottom-full left-1/2 mb-1.5 -translate-x-1/2"
      : "right-0 top-full mt-1.5";

  return (
    <div ref={rootRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-9 w-9 items-center justify-center rounded-lg border border-xau-border bg-xau-card text-lg leading-none transition hover:bg-xau-app ${
          open ? "ring-1 ring-xau-gold-accent/40" : ""
        }`}
        aria-label={`Language: ${current.label}. Click to change.`}
        aria-expanded={open}
        aria-haspopup="listbox"
        title={current.label}
      >
        <span aria-hidden>{current.flag}</span>
      </button>

      {open && others.length > 0 && (
        <ul
          role="listbox"
          aria-label="Choose language"
          className={`absolute z-50 min-w-[8.5rem] overflow-hidden rounded-lg border border-xau-border bg-xau-card py-1 shadow-lg ${menuPosition}`}
        >
          {others.map((loc) => {
            const meta = LOCALE_META[loc];
            return (
              <li key={loc} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  onClick={() => setLocale(loc)}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-xau-ink transition hover:bg-xau-gold-soft"
                >
                  <span className="text-lg leading-none" aria-hidden>
                    {meta.flag}
                  </span>
                  {meta.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
