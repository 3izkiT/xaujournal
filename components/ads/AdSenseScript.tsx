import Script from "next/script";
import { ADSENSE_CLIENT_ID, ADSENSE_ENABLED } from "@/lib/monetization";

export function AdSenseScript() {
  if (!ADSENSE_ENABLED || !ADSENSE_CLIENT_ID) return null;

  return (
    <Script
        id="adsense-loader"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
        crossOrigin="anonymous"
        strategy="lazyOnload"
    />
  );
}
