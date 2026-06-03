"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT_ID, ADSENSE_ENABLED } from "@/lib/monetization";

type Props = {
  slotId?: string;
  className?: string;
  format?: "auto" | "rectangle" | "horizontal" | "fluid";
  minHeight?: number;
  label?: boolean;
};

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export function AdSlot({
  slotId,
  className = "",
  format = "auto",
  minHeight = 90,
  label = true,
}: Props) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADSENSE_ENABLED || !ADSENSE_CLIENT_ID || !slotId || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* ignore */
    }
  }, [slotId]);

  if (!ADSENSE_ENABLED || !ADSENSE_CLIENT_ID || !slotId) {
    return null;
  }

  return (
    <aside className={className} aria-label="Advertisement">
      {label && (
        <p className="mb-1 text-center text-[10px] uppercase tracking-wider text-xau-muted">Advertisement</p>
      )}
      <ins
        className="adsbygoogle block w-full"
        style={{ display: "block", minHeight }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
