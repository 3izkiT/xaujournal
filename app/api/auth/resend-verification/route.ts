import { NextResponse } from "next/server";
import { rejectIfGoogleOnlyEmailAuth } from "@/lib/auth-api-guard";
import { findUserByEmail } from "@/lib/auth-users";
import { isDatabaseConfigured } from "@/lib/db";
import { mustVerifyEmailBeforeLogin } from "@/lib/email-verification";
import { sendEmailVerificationForUser } from "@/lib/send-verification";
import { validateEmail } from "@/lib/auth-validation";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(request: Request) {
  const blocked = rejectIfGoogleOnlyEmailAuth();
  if (blocked) return blocked;

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
    if (user && mustVerifyEmailBeforeLogin(user)) {
      const sent = await sendEmailVerificationForUser({
        id: user.id,
        email: user.email,
        name: user.name,
      });
      if (!sent.ok) {
        return NextResponse.json({ error: sent.error }, { status: 503 });
      }
    }

    return NextResponse.json({
      ok: true,
      message: "If your account needs verification, we sent a new link to your inbox.",
    });
  } catch {
    return NextResponse.json({ error: "Could not send verification email." }, { status: 500 });
  }
}
