import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/auth-users";
import { isDatabaseConfigured } from "@/lib/db";
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
    const body = (await request.json()) as { email?: string; password?: string };
    email = body.email?.trim().toLowerCase() ?? "";
    password = body.password ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const session: AppSession = {
    userId: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan as UserPlan,
  };

  const response = NextResponse.json({ ok: true, redirectTo: "/dashboard" });
  return setSessionOnResponse(response, session);
}
