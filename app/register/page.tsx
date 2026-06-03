"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

import { AuthField } from "@/components/auth/AuthField";
import { FormAlert } from "@/components/auth/FormAlert";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { PasswordField } from "@/components/auth/PasswordField";
import { TermsConsent } from "@/components/auth/TermsConsent";
import { TurnstileField } from "@/components/auth/TurnstileField";
import { BRAND_NAME } from "@/lib/brand";
import {
  PASSWORD_MIN_LENGTH,
  passwordsMatch,
  validateEmail,
  validatePassword,
} from "@/lib/auth-validation";
import { isTurnstileConfigured } from "@/lib/turnstile";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const turnstileRequired = isTurnstileConfigured();

  const passwordCheck = useMemo(() => validatePassword(password), [password]);
  const showMismatch = touched && confirmPassword.length > 0 && !passwordsMatch(password, confirmPassword);

  const validateForm = () => {
    const next: Record<string, string> = {};

    if (!name.trim()) next.name = "Enter your display name.";
    if (!email.trim()) next.email = "Enter your email address.";
    else if (!validateEmail(email)) next.email = "Enter a valid email address.";

    if (!passwordCheck.ok) next.password = passwordCheck.errors[0] ?? "Choose a stronger password.";
    if (!passwordsMatch(password, confirmPassword)) {
      next.confirmPassword = "Passwords do not match.";
    }
    if (!agreedTerms) next.terms = "You must accept the Terms and Privacy Policy.";

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);

    if (!validateForm()) return;

    if (turnstileRequired && !turnstileToken) {
      setError("Please complete the security check.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

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

    const data = (await res.json()) as { error?: string; message?: string };
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Registration failed.");
      return;
    }

    setMessage(data.message ?? "Account created. You can sign in now.");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-xau-app px-4 py-10">
      <div className="xau-card-bordered w-full max-w-md p-8">
        <Link href="/" className="text-sm font-medium text-xau-ink hover:text-xau-gold-accent">
          ← Back to home
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-xau-ink">Create your {BRAND_NAME} account</h1>
        <p className="mt-2 text-sm text-xau-muted">Early access: full journal features free while we grow with the community.</p>

        {error && (
          <div className="mt-4">
            <FormAlert variant="error">{error}</FormAlert>
          </div>
        )}
        {message && (
          <div className="mt-4">
            <FormAlert variant="success">{message}</FormAlert>
            <p className="mt-3 text-center text-sm">
              <Link href="/login" className="font-medium text-xau-ink underline hover:text-xau-gold-accent">
                Sign in now →
              </Link>
            </p>
          </div>
        )}

        <div className="mt-6 space-y-3">
          <GoogleSignInButton
            turnstileToken={turnstileToken}
            disabled={loading}
            onNeedTurnstile={() => setError("Complete the security check before Google sign-up.")}
          />
          <p className="text-center text-xs text-xau-muted">or register with email</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
          <AuthField
            id="register-name"
            label="Display name"
            name="name"
            autoComplete="name"
            required
            placeholder="How we greet you in the app"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={fieldErrors.name}
          />

          <AuthField
            id="register-email"
            label="Email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
          />

          <PasswordField
            id="register-password"
            label="Password"
            name="new-password"
            autoComplete="new-password"
            required
            minLength={PASSWORD_MIN_LENGTH}
            value={password}
            onChange={setPassword}
            hint={`At least ${PASSWORD_MIN_LENGTH} characters, with letters and numbers.`}
            error={touched ? fieldErrors.password : undefined}
          />

          <PasswordField
            id="register-confirm-password"
            label="Confirm password"
            name="confirm-password"
            autoComplete="new-password"
            required
            minLength={PASSWORD_MIN_LENGTH}
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={
              touched && (fieldErrors.confirmPassword || showMismatch) ? "Passwords do not match." : undefined
            }
          />

          <TermsConsent
            checked={agreedTerms}
            onChange={setAgreedTerms}
            error={touched ? fieldErrors.terms : undefined}
          />

          <TurnstileField className="flex justify-center" onToken={setTurnstileToken} />

          <button
            type="submit"
            disabled={loading}
            className="xau-btn-gold w-full disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-xau-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-xau-ink hover:text-xau-gold-accent">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
