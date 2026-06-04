import { NextResponse } from "next/server";
import {
  findUserForLogin,
  migrateDemoUserAfterLogin,
  verifyLoginPassword,
} from "@/lib/demo-auth";
import { isDatabaseConfigured } from "@/lib/db";
import { DEMO_EMAIL, LEGACY_DEMO_EMAIL } from "@/lib/brand";
import { DEMO_AUTH_ENABLED, isGoogleOnlyAuth } from "@/lib/auth-mode";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";
import { setSessionOnResponse, type AppSession } from "@/lib/app-session";
import { notifyLoginByEmail } from "@/lib/auth-notify";
import { mustVerifyEmailBeforeLogin } from "@/lib/email-verification";
import type { UserPlan } from "@/lib/types";

function isDemoLoginEmail(email: string) {
  return email === DEMO_EMAIL || email === LEGACY_DEMO_EMAIL;
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured) {
    return NextResponse.json(
      { error: "Database is not configured on the server. Add DATABASE_URL on Vercel." },
      { status: 503 }
    );
  }

  if (!process.env.AUTH_SECRET) {
    return NextResponse.json(
      { error: "AUTH_SECRET is not configured on the server." },
      { status: 503 }
    );
  }

  let email = "";
  let password = "";

  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      turnstileToken?: string;
    };
    email = body.email?.trim().toLowerCase() ?? "";
    password = body.password ?? "";

    if (!isDemoLoginEmail(email)) {
      const turnstile = await verifyTurnstileToken(
        body.turnstileToken,
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      );
      if (!turnstile.ok) {
        return NextResponse.json({ error: turnstile.error }, { status: 400 });
      }
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  if (isDemoLoginEmail(email) && !DEMO_AUTH_ENABLED) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  if (isGoogleOnlyAuth() && !isDemoLoginEmail(email)) {
    return NextResponse.json(
      { error: "Email sign-in is disabled. Use Continue with Google." },
      { status: 403 }
    );
  }

  const limited = checkRateLimit(rateLimitKey(request, "login", email), { limit: 12, windowMs: 60_000 });
  if (!limited.ok) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${limited.retryAfterSec}s.` },
      { status: 429 }
    );
  }

  try {
    let user = await findUserForLogin(email);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { error: "This account uses Google sign-in. Click Continue with Google." },
        { status: 401 }
      );
    }

    const valid = await verifyLoginPassword(user, password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (mustVerifyEmailBeforeLogin(user)) {
      return NextResponse.json(
        {
          error: "Verify your email before signing in. Check your inbox or request a new link.",
          code: "EMAIL_NOT_VERIFIED",
          email: user.email,
        },
        { status: 403 }
      );
    }

    user = await migrateDemoUserAfterLogin(user);

    const session: AppSession = {
      userId: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan as UserPlan,
    };

    const response = NextResponse.json({ ok: true, redirectTo: "/dashboard" });
    notifyLoginByEmail(request, { email: user.email, name: user.name });
    return setSessionOnResponse(response, session);
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json({ error: "Sign in failed. Please try again." }, { status: 500 });
  }
}
