"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const DEMO_EMAIL = "demo@xaujournal.app";
const DEMO_PASSWORD = "xaujournal2026";

const ERROR_MESSAGES: Record<string, string> = {
  empty: "Please enter your email and password.",
  invalid: "Invalid email or password.",
  db: "Server database is not configured (DATABASE_URL).",
  server: "Sign in failed. Please try again.",
};

export function LoginForm({ errorCode }: { errorCode?: string }) {
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(errorCode ? ERROR_MESSAGES[errorCode] ?? "Something went wrong." : "");
  const [loading, setLoading] = useState(false);

  const signIn = async (loginEmail: string, loginPassword: string) => {
    if (!loginEmail || !loginPassword) {
      setError(ERROR_MESSAGES.empty);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
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
    void signIn(email.trim().toLowerCase(), password);
  };

  const handleDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    void signIn(DEMO_EMAIL, DEMO_PASSWORD);
  };

  const inputClass =
    "mt-1 w-full rounded-2xl border border-xau-border bg-xau-card px-4 py-3 text-xau-ink outline-none transition focus:border-xau-gold focus:ring-2 focus:ring-xau-gold/30";

  return (
    <div className="xau-card-bordered w-full max-w-md p-8">
      <Link href="/" className="text-sm font-medium text-xau-ink hover:text-xau-gold-accent">
        ← Back to home
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-xau-ink">Sign in to XAUJournal</h1>
      <p className="mt-2 text-sm text-xau-muted">Your personal Gold trading journal workspace.</p>

      {error && (
        <p
          className="mt-4 rounded-2xl border border-xau-border bg-xau-rose px-4 py-3 text-sm font-medium text-xau-loss"
          role="alert"
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <label className="block text-sm text-xau-muted">
          Email
          <input
            type="email"
            autoComplete="email"
            className={inputClass}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block text-sm text-xau-muted">
          Password
          <input
            type="password"
            autoComplete="current-password"
            className={inputClass}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
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
          Register
        </Link>
      </p>
      <p className="mt-4 rounded-2xl bg-xau-gold-soft px-3 py-2 text-xs text-xau-ink">
        Demo: {DEMO_EMAIL} / {DEMO_PASSWORD}
      </p>
    </div>
  );
}
