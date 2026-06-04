import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/app-session";
import { isDatabaseConfigured, prisma } from "@/lib/db";

export async function POST(request: Request) {
  if (!isDatabaseConfigured) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  const session = await getAppSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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
  } catch (err) {
    console.error("[share POST]", err);
    return NextResponse.json({ error: "Failed to create share link." }, { status: 500 });
  }
}

export async function GET() {
  if (!isDatabaseConfigured) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  const session = await getAppSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const links = await prisma.shareLink.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ links });
  } catch (err) {
    console.error("[share GET]", err);
    return NextResponse.json({ error: "Failed to load share links." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isDatabaseConfigured) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  const session = await getAppSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as { id?: string };
    if (!body.id?.trim()) {
      return NextResponse.json({ error: "Missing share link id." }, { status: 400 });
    }

    const result = await prisma.shareLink.deleteMany({
      where: { id: body.id, userId: session.userId },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Share link not found." }, { status: 404 });
    }

    const links = await prisma.shareLink.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ links });
  } catch (err) {
    console.error("[share DELETE]", err);
    return NextResponse.json({ error: "Failed to revoke share link." }, { status: 500 });
  }
}
