"use client";

import { AdSlot } from "@/components/ads/AdSlot";
import { AD_SLOTS } from "@/lib/adsense";
import { ADSENSE_ENABLED } from "@/lib/monetization";

export function LandingAdTop() {
  if (!ADSENSE_ENABLED || !AD_SLOTS.homeTop) return null;
  return (
    <div className="mx-auto max-w-4xl px-6 pt-4">
      <AdSlot slotId={AD_SLOTS.homeTop} format="horizontal" minHeight={90} />
    </div>
  );
}

export function LandingAdMid() {
  if (!ADSENSE_ENABLED || !AD_SLOTS.homeMid) return null;
  return (
    <div className="mx-auto max-w-4xl px-6 py-6">
      <AdSlot slotId={AD_SLOTS.homeMid} format="auto" minHeight={250} />
    </div>
  );
}

export function LandingAdBottom() {
  if (!ADSENSE_ENABLED || !AD_SLOTS.homeBottom) return null;
  return (
    <div className="mx-auto max-w-4xl px-6 pb-8">
      <AdSlot slotId={AD_SLOTS.homeBottom} format="horizontal" minHeight={90} />
    </div>
  );
}
