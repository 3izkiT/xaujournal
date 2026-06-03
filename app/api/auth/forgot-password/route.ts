import { NextResponse } from "next/server";
import { AuthTokenType } from "@prisma/client";
import { issueAuthToken } from "@/lib/auth-tokens";
import { findUserByEmail } from "@/lib/auth-users";
import { isDatabaseConfigured } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { validateEmail } from "@/lib/auth-validation";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { SITE_URL } from "@/lib/site";

const GENERIC_OK =
  "If an account exists for that email, we sent a password reset link. Check your inbox.";

export async function POST(request: Request) {
  if (!isDatabaseConfigured) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as { email?: string; turnstileToken?: string };
    const turnstile = await verifyTurnstileToken(
      body.turnstileToken,
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    );
    if (!turnstile.ok) {
      return NextResponse.json({ error: turnstile.error }, { status: 400 });
    }

    const email = (body.email ?? "").trim().toLowerCase();
    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (user?.passwordHash) {
      const raw = await issueAuthToken(user.id, AuthTokenType.PASSWORD_RESET);
      const resetUrl = `${SITE_URL}/reset-password?token=${encodeURIComponent(raw)}`;
      const sent = await sendPasswordResetEmail({ to: user.email, name: user.name, resetUrl });
      if (!sent.ok) {
        return NextResponse.json({ error: sent.error }, { status: 503 });
      }
    }

    return NextResponse.json({ ok: true, message: GENERIC_OK });
  } catch {
    return NextResponse.json({ error: "Could not process request." }, { status: 500 });
  }
}
