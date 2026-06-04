"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AuthField } from "@/components/auth/AuthField";
import { FormAlert } from "@/components/auth/FormAlert";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { PasswordField } from "@/components/auth/PasswordField";
import { TurnstileField } from "@/components/auth/TurnstileField";
import { BRAND_NAME } from "@/lib/brand";
import { isTurnstileConfigured } from "@/lib/turnstile";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const turnstileRequired = isTurnstileConfigured();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (turnstileRequired && !turnstileToken) {
      setError("Please complete the security check.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          turnstileToken: turnstileToken ?? undefined,
        }),
      });
      const data = (await res.json()) as { error?: string; message?: string; needsVerification?: boolean };
      if (!res.ok) {
        setError(data.error ?? "Registration failed.");
        return;
      }
      setSuccess(
        data.message ??
          (data.needsVerification
            ? "Account created. Check your email to verify before signing in."
            : "Account created. You can sign in now.")
      );
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="xau-card-bordered w-full max-w-md p-8">
      <Link href="/" className="text-sm font-medium text-xau-ink hover:text-xau-gold-accent">
        ← Back to home
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-xau-ink">Create your {BRAND_NAME} account</h1>
      <p className="mt-2 text-sm text-xau-muted">Email sign-up with optional Google sign-in below.</p>

      {error && (
        <div className="mt-4">
          <FormAlert variant="error">{error}</FormAlert>
        </div>
      )}
      {success && (
        <div className="mt-4">
          <FormAlert variant="success">{success}</FormAlert>
          <Link href="/login" className="mt-3 block text-center text-sm font-medium text-xau-ink underline">
            Go to sign in
          </Link>
        </div>
      )}

      <div className="mt-6 space-y-3">
        <GoogleSignInButton
          turnstileToken={turnstileToken}
          disabled={loading}
          onNeedTurnstile={() => setError("Complete the security check before Google sign-in.")}
        />
        <p className="text-center text-xs text-xau-muted">or sign up with email</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
        <AuthField id="register-name" label="Name (optional)" name="name" value={name} onChange={(e) => setName(e.target.value)} />
        <AuthField
          id="register-email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordField
          id="register-password"
          label="Password"
          name="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={setPassword}
        />
        <PasswordField
          id="register-confirm"
          label="Confirm password"
          name="confirmPassword"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={setConfirmPassword}
        />
        <TurnstileField onToken={setTurnstileToken} />
        <button
          type="submit"
          disabled={loading}
          className="xau-btn-gold w-full py-3 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-xau-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-xau-ink underline hover:text-xau-gold-accent">
          Sign in
        </Link>
      </p>
    </div>
  );
}
