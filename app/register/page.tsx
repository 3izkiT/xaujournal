"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { TurnstileField } from "@/components/auth/TurnstileField";
import { BRAND_NAME } from "@/lib/brand";
import { isTurnstileConfigured } from "@/lib/turnstile";

const inputClass =
  "w-full rounded-2xl border border-xau-border bg-xau-card px-4 py-3 text-xau-ink outline-none transition focus:border-xau-gold focus:ring-2 focus:ring-xau-gold/30";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const turnstileRequired = isTurnstileConfigured();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
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
      body: JSON.stringify({ name, email, password, turnstileToken: turnstileToken ?? undefined }),
    });

    const data = (await res.json()) as { error?: string; message?: string };
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Registration failed.");
      return;
    }

    setMessage(data.message ?? "Account created. Please sign in.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-xau-app px-4">
      <div className="xau-card-bordered w-full max-w-md p-8">
        <Link href="/" className="text-sm font-medium text-xau-ink hover:text-xau-gold-accent">
          ← Back to home
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-xau-ink">Create your {BRAND_NAME} account</h1>
        <p className="mt-2 text-sm text-xau-muted">Early access: full journal features free while we grow with the community.</p>

        {error && <p className="mt-4 text-sm font-medium text-xau-loss">{error}</p>}
        {message && <p className="mt-4 text-sm font-medium text-tv-profit">{message}</p>}

        <div className="mt-6 space-y-3">
          <GoogleSignInButton
            turnstileToken={turnstileToken}
            disabled={loading}
            onNeedTurnstile={() => setError("Complete the security check before Google sign-up.")}
          />
          <p className="text-center text-xs text-xau-muted">or register with email</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input className={inputClass} placeholder="Display name" value={name} onChange={(e) => setName(e.target.value)} />
          <input
            type="email"
            required
            className={inputClass}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            minLength={8}
            className={inputClass}
            placeholder="Password (min 8 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TurnstileField className="flex justify-center" onToken={setTurnstileToken} />
          <button
            type="submit"
            disabled={loading}
            className="xau-btn-gold w-full disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? "Creating…" : "Create account"}
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
