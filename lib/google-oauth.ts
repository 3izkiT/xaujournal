import { randomBytes } from "crypto";
import { findOrCreateGoogleUser } from "@/lib/auth-users";
import { notifyLoginByEmail } from "@/lib/auth-notify";
import { setSessionOnResponse, type AppSession } from "@/lib/app-session";
import type { UserPlan } from "@/lib/types";
import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/site";

const STATE_COOKIE = "xau_google_oauth_state";
const SCOPES = ["openid", "email", "profile"].join(" ");

export function isGoogleAuthConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function getAuthBaseUrl() {
  const url =
    process.env.AUTH_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL === "1" ? SITE_URL : "http://localhost:3000");
  return url.replace(/\/$/, "");
}

export function googleRedirectUri() {
  return `${getAuthBaseUrl()}/api/auth/google/callback`;
}

export function buildGoogleAuthUrl(state: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error("GOOGLE_CLIENT_ID is not configured");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: googleRedirectUri(),
    response_type: "code",
    scope: SCOPES,
    state,
    access_type: "online",
    prompt: "select_account",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export function createOAuthState() {
  return randomBytes(24).toString("hex");
}

export function oauthStateCookieOptions() {
  const secure =
    process.env.AUTH_USE_SECURE_COOKIES === "true" ||
    process.env.VERCEL === "1" ||
    process.env.AUTH_URL?.startsWith("https://") === true;

  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure,
    maxAge: 60 * 10,
  };
}

export async function exchangeGoogleCode(code: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth is not configured");
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: googleRedirectUri(),
      grant_type: "authorization_code",
    }),
  });

  const tokenData = (await tokenRes.json()) as { access_token?: string; error?: string };
  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(tokenData.error ?? "Token exchange failed");
  }

  const profileRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  const profile = (await profileRes.json()) as {
    sub?: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
  };

  if (!profileRes.ok || !profile.sub || !profile.email) {
    throw new Error("Could not load Google profile");
  }

  if (profile.email_verified === false) {
    throw new Error("Google email is not verified");
  }

  return {
    sub: profile.sub,
    email: profile.email.toLowerCase(),
    name: profile.name?.trim() || profile.email.split("@")[0],
  };
}

export async function loginResponseForGoogleUser(
  profile: {
    sub: string;
    email: string;
    name: string;
  },
  request: Request
) {
  const user = await findOrCreateGoogleUser(profile);
  const session: AppSession = {
    userId: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan as UserPlan,
  };
  notifyLoginByEmail(request, { email: user.email, name: user.name });
  const response = NextResponse.redirect(`${getAuthBaseUrl()}/dashboard`);
  return setSessionOnResponse(response, session);
}

export function redirectLoginError(code: string) {
  return NextResponse.redirect(`${getAuthBaseUrl()}/?auth=login&error=${encodeURIComponent(code)}`);
}

export function setOAuthStateCookie(response: NextResponse, state: string) {
  response.cookies.set(STATE_COOKIE, state, oauthStateCookieOptions());
  return response;
}

export function readOAuthStateCookie(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`${STATE_COOKIE}=([^;]+)`));
  return match?.[1] ?? null;
}

export function clearOAuthStateCookie(response: NextResponse) {
  response.cookies.set(STATE_COOKIE, "", { ...oauthStateCookieOptions(), maxAge: 0 });
  return response;
}
