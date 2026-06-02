import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import type { UserPlan } from "@/lib/types";

export type AppSession = {
  userId: string;
  email: string;
  name: string;
  plan: UserPlan;
};

const COOKIE_NAME = "xauj_session";

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
}

export function sessionCookieOptions() {
  const secure =
    process.env.AUTH_USE_SECURE_COOKIES === "true" ||
    process.env.VERCEL === "1" ||
    process.env.AUTH_URL?.startsWith("https://") === true;

  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure,
    maxAge: 60 * 60 * 24 * 30,
  };
}

export async function createSessionToken(session: AppSession) {
  return new SignJWT({
    email: session.email,
    name: session.name,
    plan: session.plan,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.userId)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecretKey());
}

export async function setSessionOnResponse(response: NextResponse, session: AppSession) {
  const token = await createSessionToken(session);
  response.cookies.set(COOKIE_NAME, token, sessionCookieOptions());
  return response;
}

export async function getAppSession(): Promise<AppSession | null> {
  const jar = await cookies();
  const cookie = jar.get(COOKIE_NAME);
  if (!cookie?.value) return null;

  try {
    const { payload } = await jwtVerify(cookie.value, getSecretKey());
    if (!payload.sub || typeof payload.email !== "string") return null;

    return {
      userId: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : "",
      plan: (payload.plan as UserPlan) ?? "FREE",
    };
  } catch {
    return null;
  }
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
