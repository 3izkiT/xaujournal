import { RiskModel, TemplatePreset } from "@prisma/client";
import { prisma } from "@/lib/db";

export const DEFAULT_CHECKLIST = [
  { id: "plan", label: "Did I follow my strict trading plan/strategy?" },
  { id: "rr", label: "Is my Risk-to-Reward ratio at least 1:2?" },
  { id: "calm", label: "Is my mindset completely calm and free of FOMO?" },
];

export async function getOrCreateUserSettings(userId: string) {
  const existing = await prisma.userSettings.findUnique({ where: { userId } });
  if (existing) return existing;

  return prisma.userSettings.create({
    data: {
      userId,
      customChecklist: DEFAULT_CHECKLIST,
      customSetupTags: ["Liquidity Sweep", "FVG Mitigation", "Break of Structure", "Order Block"],
      customErrorTags: ["FOMO", "Revenge Trading", "Overlot", "Early exit"],
      riskModel: RiskModel.FIXED_PERCENT,
      templatePreset: TemplatePreset.INTRADAY,
    },
  });
}
