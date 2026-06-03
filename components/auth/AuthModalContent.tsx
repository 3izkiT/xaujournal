"use client";

import { GoogleOnlyAuthPanel } from "@/components/auth/GoogleOnlyAuthPanel";
import { BRAND_NAME } from "@/lib/brand";
import { EMAIL_AUTH_ENABLED } from "@/lib/auth-mode";

export type AuthModalMode = "login" | "register";

type Props = {
  mode: AuthModalMode;
  errorCode?: string;
  onSwitchMode: (mode: AuthModalMode) => void;
};

export function AuthModalContent({ mode, errorCode, onSwitchMode }: Props) {
  const isRegister = mode === "register";

  if (!EMAIL_AUTH_ENABLED) {
    return (
      <>
        <h2 id="auth-modal-title" className="pr-10 text-2xl font-semibold text-xau-ink">
          {isRegister ? `Join ${BRAND_NAME}` : `Sign in to ${BRAND_NAME}`}
        </h2>
        <p className="mt-2 text-sm text-xau-muted">
          {isRegister
            ? "One click with Google — full journal access during early access."
            : "Use the Google account you signed up with."}
        </p>
        <GoogleOnlyAuthPanel variant={mode} errorCode={errorCode} />
        <p className="mt-4 text-center text-sm text-xau-muted">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="font-medium text-xau-ink underline hover:text-xau-gold-accent"
                onClick={() => onSwitchMode("login")}
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              New here?{" "}
              <button
                type="button"
                className="font-medium text-xau-ink underline hover:text-xau-gold-accent"
                onClick={() => onSwitchMode("register")}
              >
                Create account
              </button>
            </>
          )}
        </p>
      </>
    );
  }

  return (
    <p className="text-sm text-xau-muted">
      Email sign-in is enabled —{" "}
      <a href={isRegister ? "/register" : "/login"} className="font-medium text-xau-ink underline">
        open the full {isRegister ? "sign-up" : "sign-in"} page
      </a>
      .
    </p>
  );
}
