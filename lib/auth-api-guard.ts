import { NextResponse } from "next/server";
import { isGoogleOnlyAuth } from "@/lib/auth-mode";

export function rejectIfGoogleOnlyEmailAuth() {
  if (!isGoogleOnlyAuth()) return null;
  return NextResponse.json(
    { error: "Email sign-in is disabled. Use Continue with Google on the sign-in page." },
    { status: 403 }
  );
}
