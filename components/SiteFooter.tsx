import Link from "next/link";
import { AuthModalTrigger } from "@/components/auth/AuthModalTrigger";
import { BRAND_FOOTER, BRAND_NAME } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-xau-border py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center text-xs text-xau-muted md:flex-row md:justify-between md:text-left">
        <p>
          © {new Date().getFullYear()} {BRAND_NAME} · {BRAND_FOOTER}
        </p>
        <nav className="flex flex-wrap justify-center gap-4">
          <Link href="/privacy" className="hover:text-xau-ink">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-xau-ink">
            Terms
          </Link>
          <AuthModalTrigger mode="login" className="hover:text-xau-ink">
            Sign in
          </AuthModalTrigger>
        </nav>
      </div>
    </footer>
  );
}
