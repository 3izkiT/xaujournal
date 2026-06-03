import { NextResponse } from "next/server";
import { AuthTokenType } from "@prisma/client";
import { consumeAuthToken } from "@/lib/auth-tokens";
import { markUserEmailVerified } from "@/lib/auth-users";
import { isDatabaseConfigured } from "@/lib/db";
import { getAuthBaseUrl } from "@/lib/google-oauth";

export async function GET(request: Request) {
  if (!isDatabaseConfigured) {
    return NextResponse.redirect(`${getAuthBaseUrl()}/login?error=db`);
  }

  const token = new URL(request.url).searchParams.get("token")?.trim() ?? "";
  if (!token) {
    return NextResponse.redirect(`${getAuthBaseUrl()}/login?error=verify_failed`);
  }

  const user = await consumeAuthToken(token, AuthTokenType.EMAIL_VERIFY);
  if (!user) {
    return NextResponse.redirect(`${getAuthBaseUrl()}/login?error=verify_failed`);
  }

  await markUserEmailVerified(user.id);
  return NextResponse.redirect(`${getAuthBaseUrl()}/login?verified=1`);
}
