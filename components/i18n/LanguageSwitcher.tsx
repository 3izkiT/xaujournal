"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

const LOCALE_META: Record<AppLocale, { flag: string; label: string }> = {
  en: { flag: "🇺🇸", label: "English" },
  th: { flag: "🇹🇭", label: "ไทย" },
};

type LanguageSwitcherProps = {
  className?: string;
};

export function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const locale = useLocale() as AppLocale;
  const router = useRouter();

  const setLocale = (next: AppLocale) => {
    if (next === locale) return;
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;SameSite=Lax`;
    router.refresh();
  };

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-lg border border-xau-border bg-xau-card p-0.5 ${className}`}
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((code) => {
        const loc = code as AppLocale;
        const meta = LOCALE_META[loc];
        const active = locale === loc;

        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(loc)}
            className={`flex h-8 w-9 items-center justify-center rounded-md text-lg leading-none transition ${
              active
                ? "bg-xau-gold-soft ring-1 ring-xau-gold-accent/50"
                : "opacity-55 hover:bg-xau-app hover:opacity-100"
            }`}
            aria-label={meta.label}
            aria-pressed={active}
            title={meta.label}
          >
            <span aria-hidden>{meta.flag}</span>
          </button>
        );
      })}
    </div>
  );
}
