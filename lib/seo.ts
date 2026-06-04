import type { Metadata } from "next";
import { googleVerificationMeta } from "@/lib/google-verification";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/site";

const OG_IMAGE_PATH = "/opengraph-image";

export function buildPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  const url = path.startsWith("http") ? path : `${SITE_URL}${path}`;
  return buildSiteMetadata({
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
    },
    twitter: {
      title,
      description,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  });
}

export function buildSiteMetadata(overrides?: Partial<Metadata>): Metadata {
  const titleDefault = `${SITE_NAME} — Intentional XAUUSD Trading Journal`;
  const titleTemplate = `%s · ${SITE_NAME}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: titleDefault,
      template: titleTemplate,
    },
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "Finance",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_URL,
      siteName: SITE_NAME,
      title: titleDefault,
      description: SITE_DESCRIPTION,
      images: [
        {
          url: OG_IMAGE_PATH,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — XAUUSD discipline journal`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titleDefault,
      description: SITE_DESCRIPTION,
      images: [OG_IMAGE_PATH],
    },
    icons: {
      icon: [
        { url: "/icon.png", type: "image/png", sizes: "512x512" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: [{ url: "/apple-icon.png", type: "image/png" }],
    },
    manifest: "/manifest.webmanifest",
    other: googleVerificationMeta,
    ...overrides,
  };
}

export function jsonLdWebSite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function jsonLdSoftwareApplication() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Full access during early access period",
    },
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  };
}
