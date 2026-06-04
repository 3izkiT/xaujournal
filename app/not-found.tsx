import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { BRAND_NAME } from "@/lib/brand";

export default async function NotFound() {
  const t = await getTranslations("errors");
  const common = await getTranslations("common");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-xau-app px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-xau-gold-accent">404</p>
      <h1 className="mt-3 text-3xl font-semibold text-xau-ink">{t("notFoundTitle")}</h1>
      <p className="mt-3 max-w-md text-sm text-xau-muted">{t("notFoundBody")}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="xau-btn-gold px-6 py-3">
          {common("backHome")} · {BRAND_NAME}
        </Link>
        <Link href="/login" className="xau-btn-ghost px-6 py-3">
          {common("signIn")}
        </Link>
      </div>
    </main>
  );
}
