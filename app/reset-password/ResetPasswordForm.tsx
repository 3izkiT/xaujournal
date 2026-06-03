"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { FormAlert } from "@/components/auth/FormAlert";
import { PasswordField } from "@/components/auth/PasswordField";
import { BRAND_NAME } from "@/lib/brand";
import { PASSWORD_MIN_LENGTH, passwordsMatch, validatePassword } from "@/lib/auth-validation";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const passwordCheck = useMemo(() => validatePassword(password), [password]);
  const showMismatch = touched && confirmPassword.length > 0 && !passwordsMatch(password, confirmPassword);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    setError("");
    setMessage("");

    if (!token) {
      setError("Reset link is missing or invalid. Request a new one from the forgot password page.");
      return;
    }

    if (!passwordCheck.ok) {
      setError(passwordCheck.errors[0] ?? "Choose a stronger password.");
      return;
    }

    if (!passwordsMatch(password, confirmPassword)) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = (await res.json()) as { error?: string; message?: string };
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Could not reset password.");
      return;
    }

    setMessage(data.message ?? "Password updated.");
    setPassword("");
    setConfirmPassword("");
  };

  if (!token) {
    return (
      <div className="mt-6">
        <FormAlert variant="error">This reset link is invalid. Request a new one below.</FormAlert>
        <Link href="/forgot-password" className="xau-btn-gold mt-4 inline-block">
          Request reset link
        </Link>
      </div>
    );
  }

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
          <p className="mt-3 text-center text-sm">
            <Link href="/login" className="font-medium text-xau-ink underline hover:text-xau-gold-accent">
              Sign in →
            </Link>
          </p>
        </div>
      )}

      {!message && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <PasswordField
            id="reset-password"
            label="New password"
            name="new-password"
            autoComplete="new-password"
            required
            minLength={PASSWORD_MIN_LENGTH}
            value={password}
            onChange={setPassword}
            hint={`At least ${PASSWORD_MIN_LENGTH} characters, with letters and numbers.`}
            error={touched && !passwordCheck.ok ? passwordCheck.errors[0] : undefined}
          />

          <PasswordField
            id="reset-confirm-password"
            label="Confirm new password"
            name="confirm-password"
            autoComplete="new-password"
            required
            minLength={PASSWORD_MIN_LENGTH}
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={touched && showMismatch ? "Passwords do not match." : undefined}
          />

          <button type="submit" disabled={loading} className="xau-btn-gold w-full disabled:cursor-wait disabled:opacity-60">
            {loading ? "Saving…" : "Update password"}
          </button>
        </form>
      )}
    </>
  );
}

export function ResetPasswordHeading() {
  return (
    <>
      <h1 className="mt-4 text-2xl font-semibold text-xau-ink">Choose a new password</h1>
      <p className="mt-3 text-sm leading-relaxed text-xau-muted">
        Set a new password for your {BRAND_NAME} account.
      </p>
    </>
  );
}
