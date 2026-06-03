/** GA4 measurement ID — override in Vercel if needed. */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-4NN8W5FDRK";

export function buildGa4InlineConfigSnippet(measurementId: string): string {
  return `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${measurementId}');
`.trim();
}
