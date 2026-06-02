import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/app-session";

export async function GET() {
  const session = await getAppSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: session.userId,
      email: session.email,
      name: session.name,
      plan: session.plan,
    },
  });
}
