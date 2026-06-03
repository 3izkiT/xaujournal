"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { AuthField } from "@/components/auth/AuthField";
import { FormAlert } from "@/components/auth/FormAlert";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { PasswordField } from "@/components/auth/PasswordField";
import { TurnstileField } from "@/components/auth/TurnstileField";
import { BRAND_NAME, DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/brand";
import { isTurnstileConfigured } from "@/lib/turnstile";

const ERROR_MESSAGES: Record<string, string> = {
  empty: "Please enter your email and password.",
  invalid: "Invalid email or password.",
  db: "Server database is not configured (DATABASE_URL).",
  server: "Sign in failed. Please try again.",
  google_config: "Google sign-in is not configured on the server yet.",
  google_denied: "Google sign-in was cancelled.",
  google_failed: "Google sign-in failed. Check redirect URI in Google Cloud.",
  turnstile: "Complete the security check, then try Google again.",
};

export function LoginForm({ errorCode }: { errorCode?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [error, setError] = useState(errorCode ? (ERROR_MESSAGES[errorCode] ?? "Something went wrong.") : "");
  const [loading, setLoading] = useState(false);
  const turnstileRequired = isTurnstileConfigured();

  const signIn = async (loginEmail: string, loginPassword: string, token?: string | null) => {
    if (!loginEmail || !loginPassword) {
      setError(ERROR_MESSAGES.empty);
      return;
    }

    const isDemo = loginEmail === DEMO_EMAIL || loginEmail === "demo@xaujournal.app";
    if (turnstileRequired && !isDemo && !token) {
      setError("Please complete the security check.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          turnstileToken: token ?? undefined,
        }),
      });

      let data: { error?: string; redirectTo?: string } = {};
      try {
        data = (await res.json()) as { error?: string; redirectTo?: string };
      } catch {
        setError(ERROR_MESSAGES.server);
        return;
      }

      if (!res.ok) {
        setError(data.error ?? ERROR_MESSAGES.invalid);
        return;
      }

      window.location.href = data.redirectTo ?? "/dashboard";
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void signIn(email.trim().toLowerCase(), password, turnstileToken);
  };

  const handleDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    void signIn(DEMO_EMAIL, DEMO_PASSWORD);
  };

  return (
    <div className="xau-card-bordered w-full max-w-md p-8">
      <Link href="/" className="text-sm font-medium text-xau-ink hover:text-xau-gold-accent">
        ← Back to home
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-xau-ink">Sign in to {BRAND_NAME}</h1>
      <p className="mt-2 text-sm text-xau-muted">Your personal Gold trading journal workspace.</p>

      {error && (
        <div className="mt-4">
          <FormAlert variant="error">{error}</FormAlert>
        </div>
      )}

      <div className="mt-6 space-y-3">
        <GoogleSignInButton
          turnstileToken={turnstileToken}
          disabled={loading}
          onNeedTurnstile={() => setError("Complete the security check before Google sign-in.")}
        />
        <p className="text-center text-xs text-xau-muted">or sign in with email</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
        <AuthField
          id="login-email"
          label="Email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div>
          <PasswordField
            id="login-password"
            label="Password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={setPassword}
          />
          <p className="mt-2 text-right text-xs">
            <Link href="/forgot-password" className="text-xau-muted hover:text-xau-ink">
              Forgot password?
            </Link>
          </p>
        </div>

        <TurnstileField className="flex justify-center" onToken={setTurnstileToken} />

        <button type="submit" disabled={loading} className="xau-btn-gold w-full disabled:cursor-wait disabled:opacity-60">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <button
        type="button"
        disabled={loading}
        onClick={handleDemo}
        className="mt-3 w-full rounded-2xl border border-xau-gold bg-xau-gold-soft py-2.5 text-sm font-medium text-xau-ink transition hover:brightness-[0.98] disabled:cursor-wait disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in as demo"}
      </button>

      <p className="mt-6 text-center text-sm text-xau-muted">
        No account?{" "}
        <Link href="/register" className="font-medium text-xau-ink hover:text-xau-gold-accent">
          Create account
        </Link>
      </p>
      <p className="mt-4 rounded-2xl bg-xau-gold-soft px-3 py-2 text-xs text-xau-ink">
        Demo: {DEMO_EMAIL} / {DEMO_PASSWORD}
      </p>
    </div>
  );
}
