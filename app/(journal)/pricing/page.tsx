import { PricingComingSoon } from "@/components/pricing/PricingComingSoon";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { PAYMENTS_ENABLED } from "@/lib/monetization";

export default function PricingPage() {
  if (!PAYMENTS_ENABLED) {
    return <PricingComingSoon />;
  }
  return <PricingPlans />;
}
