"use client";

import { useState } from "react";
import Link from "next/link";
import { PAYMENTS_ENABLED } from "@/lib/monetization";

/** Shown only when NEXT_PUBLIC_PAYMENTS_ENABLED=true */
export function PricingPlans() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST", credentials: "include" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Could not start checkout.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold text-xau-ink">Pricing</h2>
        <p className="mt-2 text-sm text-xau-muted">Simple subscription tiers for focused XAUUSD journaling.</p>
      </div>

      {error && <p className="text-sm text-xau-loss">{error}</p>}

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
          {PAYMENTS_ENABLED ? (
            <button
              type="button"
              disabled={loading}
              onClick={() => void startCheckout()}
              className="xau-btn-gold mt-6 inline-block disabled:opacity-60"
            >
              {loading ? "Redirecting…" : "Upgrade Now"}
            </button>
          ) : (
            <Link href="/login" className="xau-btn-gold mt-6 inline-block">
              Sign in to upgrade
            </Link>
          )}
        </article>
      </div>
    </div>
  );
}
