import { isDatabaseConfigured } from "@/lib/db";
import {
  clearOAuthStateCookie,
  exchangeGoogleCode,
  isGoogleAuthConfigured,
  loginResponseForGoogleUser,
  readOAuthStateCookie,
  redirectLoginError,
} from "@/lib/google-oauth";

export async function GET(request: Request) {
  if (!isDatabaseConfigured) {
    return redirectLoginError("db");
  }

  if (!isGoogleAuthConfigured()) {
    return redirectLoginError("google_config");
  }

  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  if (error) {
    return redirectLoginError("google_denied");
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const savedState = readOAuthStateCookie(request);

  if (!code || !state || !savedState || state !== savedState) {
    return redirectLoginError("google_failed");
  }

  try {
    const profile = await exchangeGoogleCode(code);
    const response = await loginResponseForGoogleUser(profile, request);
    return clearOAuthStateCookie(response);
  } catch {
    return redirectLoginError("google_failed");
  }
}
