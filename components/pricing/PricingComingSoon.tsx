import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";
import { isOpenAccessActive } from "@/lib/monetization";

export function PricingComingSoon() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-xau-gold-accent">Early access</p>
        <h2 className="mt-2 text-3xl font-semibold text-xau-ink">Everything is free right now</h2>
        <p className="mt-3 text-sm leading-relaxed text-xau-muted">
          {BRAND_NAME} is in a growth phase: unlimited trade logs, full analytics, gallery, and calendar — no payment
          required. We are building the product with traders first; paid plans may launch later.
        </p>
      </div>

      {isOpenAccessActive() && (
        <div className="xau-kpi-gold rounded-2xl p-5 text-sm text-xau-ink">
          <strong className="font-semibold">Your account:</strong> full access enabled. Log trades, review discipline
          data, and study charts without limits.
        </div>
      )}

      <div className="xau-card-bordered space-y-3 p-6 opacity-80">
        <p className="text-sm font-medium text-xau-ink">Future plans (not active yet)</p>
        <ul className="space-y-2 text-sm text-xau-muted">
          <li>· Core journal — intended to stay accessible</li>
          <li>· Optional premium — deeper exports, coach sharing, advanced filters (pricing TBD)</li>
          <li>· Payments will appear here when we turn them on via site settings</li>
        </ul>
      </div>

      <Link href="/dashboard" className="xau-btn-gold inline-block">
        Back to dashboard
      </Link>
    </div>
  );
}
