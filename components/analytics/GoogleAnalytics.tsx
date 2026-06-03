import Script from "next/script";
import { buildGa4InlineConfigSnippet, GA_MEASUREMENT_ID } from "@/lib/ga4-config";

/** Single GA4 gtag install — only rendered from root layout <head>. */
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID.startsWith("G-")) return null;

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-gtag" strategy="afterInteractive">
        {buildGa4InlineConfigSnippet(GA_MEASUREMENT_ID)}
      </Script>
    </>
  );
}
