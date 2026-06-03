import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { BRAND_NAME, BRAND_SHORT, BRAND_TAGLINE } from "@/lib/brand";
import { themeInitScript } from "@/lib/theme";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: `${BRAND_NAME} — ${BRAND_SHORT}`,
  description: `${BRAND_TAGLINE} Checklist, emotion, and chart study — no broker auto-sync.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="xau-theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
      </head>
      <body className={`${geistSans.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
