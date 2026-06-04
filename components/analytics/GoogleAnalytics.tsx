import Script from "next/script";
import { buildGa4InlineConfigSnippet, GA_MEASUREMENT_ID } from "@/lib/ga4-config";

/**
 * GA4 loads after idle — keeps journal/dashboard TTI fast while still tracking public pages.
 */
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID.startsWith("G-")) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="lazyOnload" />
      <Script id="ga4-config" strategy="lazyOnload">
        {buildGa4InlineConfigSnippet(GA_MEASUREMENT_ID)}
      </Script>
    </>
  );
}
