/** Resend (https://resend.com) — required in production for verify / reset / login alerts. */
export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.EMAIL_FROM?.trim());
}

/** When false or email not configured, skip verify gate (local dev). */
export function isEmailVerificationRequired() {
  if (!isEmailConfigured()) return false;
  return process.env.REQUIRE_EMAIL_VERIFICATION !== "false";
}

export function isLoginNotifyEnabled() {
  if (!isEmailConfigured()) return false;
  return process.env.LOGIN_NOTIFY_EMAIL !== "false";
}

export function emailFromAddress() {
  return process.env.EMAIL_FROM?.trim() ?? "";
}
