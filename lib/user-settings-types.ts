import { RiskModel, TemplatePreset } from "@prisma/client";

export type UserSettingsPayload = {
  customChecklist: { id: string; label: string }[];
  customSetupTags: string[];
  customErrorTags: string[];
  riskModel: string;
  templatePreset: string;
};

export function mergeSetupTagOptions(defaultTags: string[], customTags: string[]): string[] {
  const merged = [...defaultTags];
  for (const tag of customTags) {
    const trimmed = tag.trim();
    if (trimmed && !merged.includes(trimmed)) merged.push(trimmed);
  }
  return merged;
}

export function mapUserSettings(raw: {
  customChecklist: unknown;
  customSetupTags: string[];
  customErrorTags: string[];
  riskModel: RiskModel;
  templatePreset: TemplatePreset;
}): UserSettingsPayload {
  const checklist = Array.isArray(raw.customChecklist)
    ? (raw.customChecklist as { id: string; label: string }[])
    : [];

  return {
    customChecklist: checklist,
    customSetupTags: raw.customSetupTags ?? [],
    customErrorTags: raw.customErrorTags ?? [],
    riskModel: raw.riskModel,
    templatePreset: raw.templatePreset,
  };
}
