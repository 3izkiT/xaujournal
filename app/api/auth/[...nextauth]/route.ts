import { NextResponse } from "next/server";

/** Legacy NextAuth route — app uses custom JWT session via /api/auth/login instead. */
export async function GET() {
  return NextResponse.json(
    { error: "This auth endpoint is deprecated. Use /api/auth/login or /api/auth/google." },
    { status: 410 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "This auth endpoint is deprecated. Use /api/auth/login or /api/auth/google." },
    { status: 410 }
  );
}
