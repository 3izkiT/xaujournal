import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { BRAND_NAME } from "@/lib/brand";
import { buildSiteMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = buildSiteMetadata({
  title: "Privacy Policy",
  description: `How ${BRAND_NAME} collects, uses, and protects your data.`,
  alternates: { canonical: `${SITE_URL}/privacy` },
});

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-xau-app text-xau-ink">
      <header className="border-b border-xau-border px-6 py-4">
        <Link href="/" className="text-sm font-semibold hover:text-xau-gold-accent">
          ← {BRAND_NAME}
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-12 text-xau-muted">
        <h1 className="text-3xl font-semibold text-xau-ink">Privacy Policy</h1>
        <p className="text-sm">Last updated: {new Date().toISOString().slice(0, 10)}</p>

        <section className="mt-8 space-y-4 text-sm leading-relaxed">
          <p>
            {BRAND_NAME} (&quot;we&quot;) operates a web-based XAUUSD trading journal. This policy explains what we
            collect and why.
          </p>
          <h2 className="text-lg font-semibold text-xau-ink">Information we collect</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Account data: email, display name, and authentication identifiers (including Google sign-in if you use it).</li>
            <li>Journal data you enter: trades, notes, discipline checklist answers, emotions, and chart image URLs you upload.</li>
            <li>Technical data: cookies for login sessions, theme preference, and security (e.g. Cloudflare Turnstile).</li>
          </ul>
          <h2 className="text-lg font-semibold text-xau-ink">How we use data</h2>
          <p>To provide the journal, analytics, calendar, and gallery; to secure your account; and to improve the product.</p>
          <h2 className="text-lg font-semibold text-xau-ink">Advertising</h2>
          <p>
            We may display Google AdSense or similar ads in the future. Third-party ad partners may use cookies per their
            policies. You can manage ad personalization in your Google account settings.
          </p>
          <h2 className="text-lg font-semibold text-xau-ink">Data storage</h2>
          <p>Data is stored on secure cloud infrastructure (e.g. hosted PostgreSQL). We do not sell your trade journal content.</p>
          <h2 className="text-lg font-semibold text-xau-ink">Your choices</h2>
          <p>
            Contact us to request account deletion or data export. Coach share links you create are optional and under your
            control.
          </p>
          <h2 className="text-lg font-semibold text-xau-ink">Contact</h2>
          <p>
            Questions: use the support email listed on {SITE_URL} or your account provider dashboard.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
