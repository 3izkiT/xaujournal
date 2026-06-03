import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { rejectIfGoogleOnlyEmailAuth } from "@/lib/auth-api-guard";
import { AuthTokenType } from "@prisma/client";
import { consumeAuthToken } from "@/lib/auth-tokens";
import { updateUserPassword } from "@/lib/auth-users";
import { isDatabaseConfigured } from "@/lib/db";
import { validatePassword } from "@/lib/auth-validation";

export async function POST(request: Request) {
  const blocked = rejectIfGoogleOnlyEmailAuth();
  if (blocked) return blocked;

  if (!isDatabaseConfigured) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as { token?: string; password?: string };
    const token = body.token?.trim() ?? "";
    const password = body.password ?? "";

    if (!token) {
      return NextResponse.json({ error: "Reset link is invalid or expired." }, { status: 400 });
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.ok) {
      return NextResponse.json({ error: passwordCheck.errors[0] }, { status: 400 });
    }

    const user = await consumeAuthToken(token, AuthTokenType.PASSWORD_RESET);
    if (!user) {
      return NextResponse.json({ error: "Reset link is invalid or expired." }, { status: 400 });
    }

    await updateUserPassword(user.id, await bcrypt.hash(password, 10));

    return NextResponse.json({ ok: true, message: "Password updated. You can sign in now." });
  } catch {
    return NextResponse.json({ error: "Could not reset password." }, { status: 500 });
  }
}
