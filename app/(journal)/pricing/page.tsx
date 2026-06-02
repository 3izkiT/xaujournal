"use client";

import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold text-xau-ink">Pricing</h2>
        <p className="mt-2 text-sm text-xau-muted">Simple subscription tiers for focused XAUUSD journaling.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <article className="xau-card-bordered p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.15em] text-xau-muted">Free Tier</p>
          <h3 className="mt-2 text-2xl font-semibold text-xau-ink">$0</h3>
          <p className="mt-3 text-sm text-xau-muted">Perfect for getting started with disciplined journaling.</p>
          <ul className="mt-5 space-y-2 text-sm text-xau-muted">
            <li>Up to 10 trade logs</li>
            <li>Discipline checklist + score</li>
            <li>Dashboard and calendar previews</li>
          </ul>
        </article>

        <article className="rounded-3xl border border-xau-gold bg-xau-gold-soft p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.15em] text-xau-gold-accent">Premium Gold Tier</p>
          <h3 className="mt-2 text-2xl font-semibold text-xau-ink">$9/month</h3>
          <p className="mt-3 text-sm text-xau-muted">For serious traders who want full history and deep review.</p>
          <ul className="mt-5 space-y-2 text-sm text-xau-ink">
            <li>Unlimited trade logs</li>
            <li>Advanced discipline analytics</li>
            <li>Full gallery + future export tools</li>
          </ul>
          <Link
            href="/login"
            className="xau-btn-gold mt-6 inline-block"
          >
            Upgrade Now
          </Link>
        </article>
      </div>
    </div>
  );
}
