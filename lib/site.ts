import { BRAND_NAME, BRAND_SLUG, BRAND_TAGLINE } from "@/lib/brand";

/** Canonical site URL — set NEXT_PUBLIC_SITE_URL on Vercel (e.g. https://xaurite.app) */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://xaurite.app").replace(/\/$/, "");

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
