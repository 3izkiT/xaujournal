"use client";

import Link from "next/link";
import { useActionState } from "react";
import { authenticate, type LoginState } from "@/app/login/actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(authenticate, initialState);

  const fillDemo = () => {
    const email = document.getElementById("login-email") as HTMLInputElement | null;
    const password = document.getElementById("login-password") as HTMLInputElement | null;
    if (email) email.value = "demo@xaujournal.app";
    if (password) password.value = "xaujournal2026";
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <Link href="/" className="text-sm text-sky-600 hover:underline">
        ← Back to home
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-slate-900">Sign in to XAUJournal</h1>
      <p className="mt-2 text-sm text-slate-500">Your personal Gold trading journal workspace.</p>

      <form action={formAction} className="mt-6 space-y-4">
        <input
          id="login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue="demo@xaujournal.app"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          placeholder="Email"
        />
        <input
          id="login-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          placeholder="Password"
        />
        {state?.error && <p className="text-sm text-rose-600">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-2xl bg-sky-100 py-3 font-medium text-sky-800 hover:bg-sky-200 disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <button
        type="button"
        onClick={fillDemo}
        className="mt-3 w-full rounded-2xl border border-amber-200 bg-amber-50 py-2.5 text-sm font-medium text-amber-800 hover:bg-amber-100"
      >
        Fill demo account
      </button>

      <p className="mt-6 text-center text-sm text-slate-500">
        No account?{" "}
        <Link href="/register" className="text-sky-600 hover:underline">
          Register
        </Link>
      </p>
      <p className="mt-4 rounded-2xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
        Demo: demo@xaujournal.app / xaujournal2026
      </p>
    </div>
  );
}
