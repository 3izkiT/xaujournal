"use client";

import Link from "next/link";
import { useEffect } from "react";
import { BRAND_NAME } from "@/lib/brand";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-xau-app px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-xau-loss">Error</p>
      <h1 className="mt-3 text-3xl font-semibold text-xau-ink">Something went wrong</h1>
      <p className="mt-3 max-w-md text-sm text-xau-muted">
        An unexpected error occurred. Try again, or return home if the problem persists. ({BRAND_NAME})
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="xau-btn-gold px-6 py-3">
          Try again
        </button>
        <Link href="/" className="xau-btn-ghost px-6 py-3">
          Back to home
        </Link>
      </div>
    </main>
  );
}
