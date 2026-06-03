/** Google Search Console — HTML tag method (not DNS on *.vercel.app). */
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() ||
  "mnXu7T1zXJUJwNHNCqs0Gq3Of5Br2O9oaCAegfV2Doc";

export const googleVerificationMeta = {
  "google-site-verification": GOOGLE_SITE_VERIFICATION,
} as const;
