"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { AuthField } from "@/components/auth/AuthField";
import { FormAlert } from "@/components/auth/FormAlert";
import { TurnstileField } from "@/components/auth/TurnstileField";
import { isTurnstileConfigured } from "@/lib/turnstile";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const turnstileRequired = isTurnstileConfigured();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }

    if (turnstileRequired && !turnstileToken) {
      setError("Please complete the security check.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), turnstileToken: turnstileToken ?? undefined }),
    });
    const data = (await res.json()) as { error?: string; message?: string };
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Could not send reset email.");
      return;
    }

    setMessage(data.message ?? "Check your email for a reset link.");
  };

  return (
    <>
      {error && (
        <div className="mt-4">
          <FormAlert variant="error">{error}</FormAlert>
        </div>
      )}
      {message && (
        <div className="mt-4">
          <FormAlert variant="success">{message}</FormAlert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <AuthField
          id="forgot-email"
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

        <TurnstileField className="flex justify-center" onToken={setTurnstileToken} />

        <button type="submit" disabled={loading} className="xau-btn-gold w-full disabled:cursor-wait disabled:opacity-60">
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-xau-muted">
        Remember your password?{" "}
        <Link href="/login" className="font-medium text-xau-ink hover:text-xau-gold-accent">
          Sign in
        </Link>
      </p>
      <p className="mt-3 text-center text-xs text-xau-muted">
        Google-only accounts: use <strong className="text-xau-ink">Continue with Google</strong> on the sign-in page.
      </p>
    </>
  );
}
