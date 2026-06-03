import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { BRAND_NAME } from "@/lib/brand";
import { buildSiteMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = buildSiteMetadata({
  title: "Terms of Use",
  description: `Terms for using the ${BRAND_NAME} XAUUSD trading journal.`,
  alternates: { canonical: `${SITE_URL}/terms` },
});

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-xau-app text-xau-ink">
      <header className="border-b border-xau-border px-6 py-4">
        <Link href="/" className="text-sm font-semibold hover:text-xau-gold-accent">
          ← {BRAND_NAME}
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-semibold">Terms of Use</h1>
        <p className="mt-2 text-sm text-xau-muted">Last updated: {new Date().toISOString().slice(0, 10)}</p>

        <div className="mt-8 space-y-4 text-sm leading-relaxed text-xau-muted">
          <p>
            By using {BRAND_NAME}, you agree to these terms. The service is an educational journaling tool — not
            investment advice, signals, or brokerage.
          </p>
          <p>You are responsible for the accuracy of trades you log and for keeping your login credentials secure.</p>
          <p>
            During early access, features may be offered free. We may change pricing or features with notice; paid plans
            are optional when introduced.
          </p>
          <p>We may suspend accounts that abuse the service, attempt fraud, or automate spam registrations.</p>
          <p>The service is provided &quot;as is&quot; without warranties. Limitation of liability applies to the extent permitted by law.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
