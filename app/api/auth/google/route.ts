import { NextResponse } from "next/server";
import {
  buildGoogleAuthUrl,
  createOAuthState,
  isGoogleAuthConfigured,
  redirectLoginError,
  setOAuthStateCookie,
} from "@/lib/google-oauth";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function GET(request: Request) {
  if (!isGoogleAuthConfigured()) {
    return redirectLoginError("google_config");
  }

  const url = new URL(request.url);
  const turnstile = await verifyTurnstileToken(
    url.searchParams.get("turnstile") ?? undefined,
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  );
  if (!turnstile.ok) {
    return redirectLoginError("turnstile");
  }

  const state = createOAuthState();
  const response = NextResponse.redirect(buildGoogleAuthUrl(state));
  return setOAuthStateCookie(response, state);
}
