import type { Metadata } from "next";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import { SITE_URL } from "@/lib/site";

const HOME_TITLE = `${BRAND_NAME} — XAUUSD Gold Trading Journal | Discipline Log`;
const HOME_DESCRIPTION =
  "Free XAUUSD trading journal for gold traders. Manual trade logs with discipline checklist, emotion tracking, chart gallery, and TradingView-style analytics. No MT5 sync — log every XAU trade on purpose.";

export const homePageMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  keywords: [
    "XAUUSD trading journal",
    "gold trading journal",
    "XAU journal app",
    "manual trading journal",
    "gold discipline tracker",
    "XAUUSD log",
    "trading journal free",
    BRAND_NAME,
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    siteName: BRAND_NAME,
    locale: "en_US",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: HOME_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        other: {
          "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

export const HOME_HERO_SEO_LINE = `${BRAND_TAGLINE} The intentional XAUUSD (gold) journal — checklist, charts, and analytics.`;
