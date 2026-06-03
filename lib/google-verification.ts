/** Google Search Console — HTML tag + /google*.html file (DNS not available on *.vercel.app). */
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() ||
  "k9MTRy1E07AzN-DpNy8UvRHtmR5vQ-ETMKJua-dPbdA";

/** HTML file verification — keep this file in /public after deploy. */
export const GOOGLE_SITE_VERIFICATION_FILE = "googleff0d26e06bfa3e67.html";

export const googleVerificationMeta = {
  "google-site-verification": GOOGLE_SITE_VERIFICATION,
} as const;
