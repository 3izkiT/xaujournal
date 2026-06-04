import type { Metadata } from "next";
import { PricingComingSoon } from "@/components/pricing/PricingComingSoon";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { PAYMENTS_ENABLED } from "@/lib/monetization";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Pricing — XAUUSD journal plans",
  description:
    "Compare XAURite journal plans for intentional XAUUSD traders. Discipline checklists, analytics, and chart gallery.",
  path: "/pricing",
});

export default function PublicPricingPage() {
  return (
    <main className="xau-page-wide py-10">
      {PAYMENTS_ENABLED ? <PricingPlans /> : <PricingComingSoon />}
    </main>
  );
}
