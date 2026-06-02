import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registerUser } from "@/lib/auth-users";
import { isDatabaseConfigured } from "@/lib/db";

export async function POST(request: Request) {
  if (!isDatabaseConfigured) {
    return NextResponse.json(
      { error: "Database is not configured. Please set DATABASE_URL." },
      { status: 503 }
    );
  }
  try {
    const body = (await request.json()) as { email?: string; password?: string; name?: string };
    const password = body.password ?? "";
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const result = await registerUser({
      email: body.email ?? "",
      passwordHash: await bcrypt.hash(password, 10),
      name: body.name ?? "",
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      message: "Account created. You can sign in now.",
    });
  } catch {
    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}
