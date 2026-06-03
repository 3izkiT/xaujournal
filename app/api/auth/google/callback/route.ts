import { isDatabaseConfigured } from "@/lib/db";
import {
  clearOAuthStateCookie,
  exchangeGoogleCode,
  isGoogleAuthConfigured,
  loginResponseForGoogleUser,
  readOAuthRedirectUriCookie,
  readOAuthStateCookie,
  redirectLoginError,
} from "@/lib/google-oauth";
import { googleCallbackUrl, resolveRequestOrigin } from "@/lib/request-origin";

export async function GET(request: Request) {
  if (!isDatabaseConfigured) {
    return redirectLoginError(request, "db");
  }

  if (!isGoogleAuthConfigured()) {
    return redirectLoginError(request, "google_config");
  }

  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  if (error) {
    return redirectLoginError(request, "google_denied");
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const savedState = readOAuthStateCookie(request);
  const redirectUri =
    readOAuthRedirectUriCookie(request) ?? googleCallbackUrl(resolveRequestOrigin(request));

  if (!code || !state || !savedState || state !== savedState) {
    return redirectLoginError(request, "google_failed");
  }

  try {
    const profile = await exchangeGoogleCode(code, redirectUri);
    const response = await loginResponseForGoogleUser(profile, request);
    return clearOAuthStateCookie(response);
  } catch {
    return redirectLoginError(request, "google_failed");
  }
}
