import { BRAND_NAME, BRAND_SLUG, BRAND_TAGLINE } from "@/lib/brand";

/** Production alias while validating interest before a custom domain. */
export const DEFAULT_PUBLIC_URL = "https://xaurite.vercel.app";

function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.AUTH_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "");
  }

  return DEFAULT_PUBLIC_URL;
}

/** Canonical site URL for SEO, OAuth redirects, and share links. */
export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = BRAND_NAME;
export const SITE_DESCRIPTION = `${BRAND_TAGLINE} Manual XAUUSD journal with discipline checklist, emotion tracking, chart gallery, and TradingView-style analytics. No MT5 sync.`;
export const SITE_KEYWORDS = [
  "XAUUSD journal",
  "gold trading journal",
  "XAUUSD discipline",
  "manual trading log",
  "gold trader journal",
  "trading checklist",
  "XAU journal",
  BRAND_SLUG,
  "intentional trading",
  "no MT5 sync journal",
];

export const SEO_DEFAULT_IMAGE = `${SITE_URL}/opengraph-image`;
