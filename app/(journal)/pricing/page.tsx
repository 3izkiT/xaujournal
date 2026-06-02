"use client";

import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold text-slate-900">Pricing</h2>
        <p className="mt-2 text-sm text-slate-500">Simple subscription tiers for focused XAUUSD journaling.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.15em] text-slate-400">Free Tier</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">$0</h3>
          <p className="mt-3 text-sm text-slate-500">Perfect for getting started with disciplined journaling.</p>
          <ul className="mt-5 space-y-2 text-sm text-slate-600">
            <li>Up to 10 trade logs</li>
            <li>Discipline checklist + score</li>
            <li>Dashboard and calendar previews</li>
          </ul>
        </article>

        <article className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.15em] text-amber-500">Premium Gold Tier</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">$9/month</h3>
          <p className="mt-3 text-sm text-slate-600">For serious traders who want full history and deep review.</p>
          <ul className="mt-5 space-y-2 text-sm text-slate-700">
            <li>Unlimited trade logs</li>
            <li>Advanced discipline analytics</li>
            <li>Full gallery + future export tools</li>
          </ul>
          <Link
            href="/journal-entry"
            className="mt-6 inline-block rounded-2xl bg-amber-200 px-5 py-3 text-sm font-medium text-amber-900 transition hover:bg-amber-300"
          >
            Upgrade Now
          </Link>
        </article>
      </div>
    </div>
  );
}
