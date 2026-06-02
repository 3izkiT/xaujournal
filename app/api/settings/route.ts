import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { getOrCreateUserSettings } from "@/lib/user-settings";
import { prisma } from "@/lib/db";
import { RiskModel, TemplatePreset } from "@prisma/client";

export async function GET() {
  if (!isDatabaseConfigured) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getOrCreateUserSettings(session.user.id);
  return NextResponse.json({ settings });
}

export async function PATCH(request: Request) {
  if (!isDatabaseConfigured) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  await getOrCreateUserSettings(session.user.id);

  const settings = await prisma.userSettings.update({
    where: { userId: session.user.id },
    data: {
      customChecklist: body.customChecklist,
      customSetupTags: body.customSetupTags,
      customErrorTags: body.customErrorTags,
      riskModel: body.riskModel as RiskModel | undefined,
      templatePreset: body.templatePreset as TemplatePreset | undefined,
    },
  });

  return NextResponse.json({ settings });
}
