"use client";

import Link from "next/link";
import { useState } from "react";

import { FormAlert } from "@/components/auth/FormAlert";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { TermsConsent } from "@/components/auth/TermsConsent";
import { TurnstileField } from "@/components/auth/TurnstileField";
import { BRAND_NAME, DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/brand";
import { DEMO_AUTH_ENABLED } from "@/lib/auth-mode";
import { isTurnstileConfigured } from "@/lib/turnstile";

type Props = {
  variant: "login" | "register";
  errorCode?: string;
};

const ERROR_MESSAGES: Record<string, string> = {
  google_config: "Google sign-in is not configured on the server yet.",
  google_denied: "Google sign-in was cancelled.",
  google_failed: "Google sign-in failed. Check redirect URI in Google Cloud.",
  turnstile: "Complete the security check, then try Google again.",
  db: "Server database is not configured (DATABASE_URL).",
};

export function GoogleOnlyAuthPanel({ variant, errorCode }: Props) {
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [error, setError] = useState(errorCode ? (ERROR_MESSAGES[errorCode] ?? "Something went wrong.") : "");
  const [demoLoading, setDemoLoading] = useState(false);
  const turnstileRequired = isTurnstileConfigured();
  const isRegister = variant === "register";

  const handleNeedTurnstile = () => {
    setError("Complete the security check before continuing with Google.");
  };

  const guardGoogleNavigate = () => {
    if (isRegister && !agreedTerms) {
      setTermsError("You must accept the Terms and Privacy Policy.");
      return false;
    }
    setTermsError("");
    return true;
  };

  const signInDemo = async () => {
    setDemoLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: DEMO_EMAIL, password: DEMO_PASSWORD }),
      });
      const data = (await res.json()) as { error?: string; redirectTo?: string };
      if (!res.ok) {
        setError(data.error ?? "Demo sign-in failed.");
        return;
      }
      window.location.href = data.redirectTo ?? "/dashboard";
    } catch {
      setError("Network error. Try again.");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mt-4">
          <FormAlert variant="error">{error}</FormAlert>
        </div>
      )}

      {isRegister && (
        <div className="mt-6">
          <TermsConsent checked={agreedTerms} onChange={setAgreedTerms} error={termsError} />
        </div>
      )}

      <div className={isRegister ? "mt-4 space-y-3" : "mt-6 space-y-3"}>
        <GoogleSignInButton
          turnstileToken={turnstileToken}
          disabled={demoLoading}
          onBeforeNavigate={guardGoogleNavigate}
          onNeedTurnstile={handleNeedTurnstile}
          label={isRegister ? "Sign up with Google" : "Continue with Google"}
        />
        <p className="text-center text-xs leading-relaxed text-xau-muted">
          {isRegister
            ? "Your Google account creates your journal — no password to remember."
            : "Sign in with the Google account you used when you joined."}
        </p>
      </div>

      <TurnstileField className="mt-4 flex justify-center" onToken={setTurnstileToken} />

      {turnstileRequired && !turnstileToken && (
        <p className="mt-2 text-center text-xs text-xau-muted">Complete the security check above, then use Google.</p>
      )}

      {DEMO_AUTH_ENABLED && (
        <button
          type="button"
          disabled={demoLoading}
          onClick={() => void signInDemo()}
          className="mt-4 w-full rounded-2xl border border-xau-border py-2.5 text-sm font-medium text-xau-muted hover:bg-xau-app disabled:opacity-60"
        >
          {demoLoading ? "Signing in…" : "Demo access (internal)"}
        </button>
      )}

      <p className="mt-6 text-center text-xs text-xau-muted">
        By using {BRAND_NAME}, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-xau-ink">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-xau-ink">
          Privacy Policy
        </Link>
        .
      </p>
    </>
  );
}
