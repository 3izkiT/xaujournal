"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const DEMO_EMAIL = "demo@xaujournal.app";
const DEMO_PASSWORD = "xaujournal2026";

export function LoginForm() {
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const performLogin = async (loginEmail: string, loginPassword: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = (await res.json()) as { error?: string; redirectTo?: string };

      if (!res.ok) {
        setError(data.error ?? "Sign in failed.");
        return;
      }

      window.location.assign(data.redirectTo ?? "/dashboard");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void performLogin(email.trim(), password);
  };

  const signInAsDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    void performLogin(DEMO_EMAIL, DEMO_PASSWORD);
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <Link href="/" className="text-sm text-sky-600 hover:underline">
        ← Back to home
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-slate-900">Sign in to XAUJournal</h1>
      <p className="mt-2 text-sm text-slate-500">Your personal Gold trading journal workspace.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-rose-600">{error}</p>}
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
        onClick={signInAsDemo}
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
