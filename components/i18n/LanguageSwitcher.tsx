"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();

  const setLocale = (next: AppLocale) => {
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;SameSite=Lax`;
    router.refresh();
  };

  return (
    <label className={`flex items-center gap-2 text-xs text-xau-muted ${className}`}>
      <span className="sr-only">Language</span>
      <select
        className="rounded-lg border border-xau-border bg-xau-card px-2 py-1.5 text-xs text-xau-ink"
        value={locale}
        onChange={(e) => setLocale(e.target.value as AppLocale)}
        aria-label="Language"
      >
        {routing.locales.map((code) => (
          <option key={code} value={code}>
            {code === "th" ? "ไทย" : "English"}
          </option>
        ))}
      </select>
    </label>
  );
}
