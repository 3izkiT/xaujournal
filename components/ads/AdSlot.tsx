"use client";

import { useEffect } from "react";
import { ADSENSE_CLIENT_ID, ADSENSE_ENABLED } from "@/lib/monetization";

type Props = {
  slot: string;
  className?: string;
  format?: "auto" | "rectangle" | "horizontal";
};

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export function AdSlot({ slot, className = "", format = "auto" }: Props) {
  useEffect(() => {
    if (!ADSENSE_ENABLED || !ADSENSE_CLIENT_ID) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ignore */
    }
  }, []);

  if (!ADSENSE_ENABLED || !ADSENSE_CLIENT_ID) {
    return null;
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
