import { buildGa4InlineConfigSnippet, GA_MEASUREMENT_ID } from "@/lib/ga4-config";

/**
 * Plain <script> in <head> (not next/script) so Search Console / crawlers see gtag in initial HTML.
 * Only include once — root layout only.
 */
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID.startsWith("G-")) return null;

  return (
    <>
      <script
        suppressHydrationWarning
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: buildGa4InlineConfigSnippet(GA_MEASUREMENT_ID),
        }}
      />
    </>
  );
}
