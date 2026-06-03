import type { Metadata } from "next";
import { RegisterPageClient } from "@/app/register/RegisterPageClient";
import { buildSiteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSiteMetadata({
  title: "Sign up",
  robots: { index: true, follow: true },
});

export default function RegisterPage() {
  return <RegisterPageClient />;
}
