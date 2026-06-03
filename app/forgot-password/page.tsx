import Link from "next/link";
import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/brand";
import { buildSiteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSiteMetadata({
  title: "Forgot password",
  robots: { index: false, follow: false },
});

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-xau-app px-4">
      <div className="xau-card-bordered w-full max-w-md p-8 text-center">
        <Link href="/login" className="text-sm font-medium text-xau-ink hover:text-xau-gold-accent">
          ← Back to sign in
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-xau-ink">Reset your password</h1>
        <p className="mt-3 text-sm leading-relaxed text-xau-muted">
          Password reset by email is coming soon. If you signed up with Google, use{" "}
          <strong className="text-xau-ink">Continue with Google</strong> on the sign-in page.
        </p>
        <p className="mt-4 text-sm text-xau-muted">
          For {BRAND_NAME} accounts created with email, contact support from the address you used to register.
        </p>
        <Link href="/login" className="xau-btn-gold mt-6 inline-block">
          Return to sign in
        </Link>
      </div>
    </div>
  );
}
