import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registerUser } from "@/lib/auth-users";
import { isDatabaseConfigured } from "@/lib/db";
import { isEmailVerificationRequired } from "@/lib/email-config";
import { sendEmailVerificationForUser } from "@/lib/send-verification";
import { validateEmail, validatePassword } from "@/lib/auth-validation";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(request: Request) {
  if (!isDatabaseConfigured) {
    return NextResponse.json(
      { error: "Database is not configured. Please set DATABASE_URL." },
      { status: 503 }
    );
  }
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      name?: string;
      turnstileToken?: string;
    };

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

    const password = body.password ?? "";
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.ok) {
      return NextResponse.json({ error: passwordCheck.errors[0] }, { status: 400 });
    }

    const result = await registerUser({
      email,
      passwordHash: await bcrypt.hash(password, 10),
      name: body.name ?? "",
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    if (isEmailVerificationRequired()) {
      const sent = await sendEmailVerificationForUser({
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      });
      if (!sent.ok) {
        return NextResponse.json({ error: sent.error }, { status: 503 });
      }
      return NextResponse.json({
        ok: true,
        needsVerification: true,
        message: "Account created. Check your email to verify before signing in.",
      });
    }

    return NextResponse.json({
      ok: true,
      message: "Account created. You can sign in now.",
    });
  } catch {
    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}
