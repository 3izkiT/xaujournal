import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/app-session";
import { isDatabaseConfigured } from "@/lib/db";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  if (!isDatabaseConfigured) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }
  const session = await getAppSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const label = typeof body.label === "string" ? body.label : "Coach view";
  const token = randomBytes(16).toString("hex");
  const expiresAt = body.expiresInDays
    ? new Date(Date.now() + Number(body.expiresInDays) * 86400000)
    : null;

  const link = await prisma.shareLink.create({
    data: {
      userId: session.userId,
      token,
      label,
      expiresAt,
    },
  });

  const base = process.env.AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "";
  const url = `${base.replace(/\/$/, "")}/share/${link.token}`;

  return NextResponse.json({ link, url });
}

export async function GET() {
  if (!isDatabaseConfigured) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }
  const session = await getAppSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const links = await prisma.shareLink.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ links });
}
