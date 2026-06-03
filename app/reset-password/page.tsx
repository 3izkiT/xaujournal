import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { buildSiteMetadata } from "@/lib/seo";
import { ResetPasswordForm, ResetPasswordHeading } from "./ResetPasswordForm";

export const metadata: Metadata = buildSiteMetadata({
  title: "Reset password",
  robots: { index: false, follow: false },
});

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-xau-app px-4">
      <div className="xau-card-bordered w-full max-w-md p-8">
        <Link href="/login" className="text-sm font-medium text-xau-ink hover:text-xau-gold-accent">
          ← Back to sign in
        </Link>
        <ResetPasswordHeading />
        <Suspense fallback={<p className="mt-6 text-sm text-xau-muted">Loading…</p>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
