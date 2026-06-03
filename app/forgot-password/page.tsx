import Link from "next/link";
import type { Metadata } from "next";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { BRAND_NAME } from "@/lib/brand";
import { isGoogleOnlyAuth } from "@/lib/auth-mode";
import { buildSiteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSiteMetadata({
  title: "Forgot password",
  robots: { index: false, follow: false },
});

export default function ForgotPasswordPage() {
  if (isGoogleOnlyAuth()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-xau-app px-4">
        <div className="xau-card-bordered w-full max-w-md p-8 text-center">
          <Link href="/login" className="text-sm font-medium text-xau-ink hover:text-xau-gold-accent">
            ← Back to sign in
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-xau-ink">Password reset</h1>
          <p className="mt-3 text-sm leading-relaxed text-xau-muted">
            {BRAND_NAME} uses Google sign-in only. Manage your password in your Google account, or sign in with the
            same Google account you used to join.
          </p>
          <Link href="/login" className="xau-btn-gold mt-6 inline-block">
            Continue with Google
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-xau-app px-4">
      <div className="xau-card-bordered w-full max-w-md p-8">
        <Link href="/login" className="text-sm font-medium text-xau-ink hover:text-xau-gold-accent">
          ← Back to sign in
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-xau-ink">Reset your password</h1>
        <p className="mt-3 text-sm leading-relaxed text-xau-muted">
          Enter the email you used for {BRAND_NAME}. We will send a link to choose a new password.
        </p>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
