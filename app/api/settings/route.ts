import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/app-session";
import { isDatabaseConfigured } from "@/lib/db";
import { getOrCreateUserSettings } from "@/lib/user-settings";
import { prisma } from "@/lib/db";
import { RiskModel, TemplatePreset } from "@prisma/client";

export async function GET() {
  if (!isDatabaseConfigured) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }
  const session = await getAppSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getOrCreateUserSettings(session.userId);
  return NextResponse.json({ settings });
}

export async function PATCH(request: Request) {
  if (!isDatabaseConfigured) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }
  const session = await getAppSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  await getOrCreateUserSettings(session.userId);

  const settings = await prisma.userSettings.update({
    where: { userId: session.userId },
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
