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

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <Link href="/" className="text-sm text-sky-600 hover:underline">
        ← Back to home
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-slate-900">Sign in to XAUJournal</h1>
      <p className="mt-2 text-sm text-slate-500">Your personal Gold trading journal workspace.</p>

      {error && (
        <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <label className="block text-sm text-slate-600">
          Email
          <input
            type="email"
            autoComplete="email"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block text-sm text-slate-600">
          Password
          <input
            type="password"
            autoComplete="current-password"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-sky-100 py-3 font-medium text-sky-800 hover:bg-sky-200 disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <button
        type="button"
        disabled={loading}
        onClick={handleDemo}
        className="mt-3 w-full rounded-2xl border border-amber-200 bg-amber-50 py-2.5 text-sm font-medium text-amber-800 hover:bg-amber-100 disabled:cursor-wait disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in as demo"}
      </button>

      <p className="mt-6 text-center text-sm text-slate-500">
        No account?{" "}
        <Link href="/register" className="text-sky-600 hover:underline">
          Register
        </Link>
      </p>
      <p className="mt-4 rounded-2xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
        Demo: {DEMO_EMAIL} / {DEMO_PASSWORD}
      </p>
    </div>
  );
}
