/**
 * Auth mode — default: Google-only (no email/password sign-up).
 * Set NEXT_PUBLIC_EMAIL_AUTH_ENABLED=true to restore email register/login.
 */
export const EMAIL_AUTH_ENABLED = process.env.NEXT_PUBLIC_EMAIL_AUTH_ENABLED === "true";

export function isGoogleOnlyAuth() {
  return !EMAIL_AUTH_ENABLED;
}

/** Demo email login — off in production unless explicitly enabled. */
export const DEMO_AUTH_ENABLED =
  process.env.NEXT_PUBLIC_DEMO_AUTH_ENABLED === "true" ||
  (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_DEMO_AUTH_ENABLED !== "false");

export function authStartPath() {
  return isGoogleOnlyAuth() ? "/login" : "/register";
}
