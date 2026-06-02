import { NextResponse } from "next/server";
import { signIn } from "@/auth";
import { isDatabaseConfigured } from "@/lib/db";

function isFailedSignInUrl(url: string) {
  const lower = url.toLowerCase();
  return lower.includes("/login") || lower.includes("error=");
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured) {
    return NextResponse.json(
      { error: "Database is not configured on the server. Add DATABASE_URL on Vercel." },
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

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      redirectTo: "/dashboard",
    });

    const url = typeof result === "string" ? result : "";
    if (!url || isFailedSignInUrl(url)) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    return NextResponse.json({ ok: true, redirectTo: "/dashboard" });
  } catch {
    return NextResponse.json({ error: "Sign in failed. Please try again." }, { status: 500 });
  }
}
