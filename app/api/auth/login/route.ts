import { NextResponse } from "next/server";
import {
  findUserForLogin,
  migrateDemoUserAfterLogin,
  verifyLoginPassword,
} from "@/lib/demo-auth";
import { isDatabaseConfigured } from "@/lib/db";
import { DEMO_EMAIL, LEGACY_DEMO_EMAIL } from "@/lib/brand";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { setSessionOnResponse, type AppSession } from "@/lib/app-session";
import type { UserPlan } from "@/lib/types";

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

    const isDemoLogin = email === DEMO_EMAIL || email === LEGACY_DEMO_EMAIL;
    if (!isDemoLogin) {
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

  user = await migrateDemoUserAfterLogin(user);

  const session: AppSession = {
    userId: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan as UserPlan,
  };

  const response = NextResponse.json({ ok: true, redirectTo: "/dashboard" });
  return setSessionOnResponse(response, session);
}
