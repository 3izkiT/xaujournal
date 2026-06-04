import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-xau-app px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-xau-gold-accent">404</p>
      <h1 className="mt-3 text-3xl font-semibold text-xau-ink">Page not found</h1>
      <p className="mt-3 max-w-md text-sm text-xau-muted">
        This link may be expired, mistyped, or the page was moved. Coach share links expire after 30 days.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="xau-btn-gold px-6 py-3">
          Back to home · {BRAND_NAME}
        </Link>
        <Link href="/login" className="xau-btn-ghost px-6 py-3">
          Sign in
        </Link>
      </div>
    </main>
  );
}
