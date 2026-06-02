import { DisciplineChecklist, JournalTrade } from "@/lib/types";

export const RULE_LABELS = {
  followedPlan: "Broke trading plan",
  rrAtLeastOneToTwo: "RR below 1:2",
  calmMindset: "Mindset not calm (FOMO/revenge risk)",
} as const satisfies Record<keyof DisciplineChecklist, string>;

export type RuleBreakKey = keyof DisciplineChecklist;

export function getRuleBreaksFromChecklist(checklist: DisciplineChecklist): RuleBreakKey[] {
  const breaks: RuleBreakKey[] = [];
  if (!checklist.followedPlan) breaks.push("followedPlan");
  if (!checklist.rrAtLeastOneToTwo) breaks.push("rrAtLeastOneToTwo");
  if (!checklist.calmMindset) breaks.push("calmMindset");
  return breaks;
}

export function getRuleBreakStats(trades: JournalTrade[]) {
  const counts: Record<RuleBreakKey, number> = {
    followedPlan: 0,
    rrAtLeastOneToTwo: 0,
    calmMindset: 0,
  };

  for (const trade of trades) {
    for (const key of getRuleBreaksFromChecklist(trade.disciplineChecklist)) {
      counts[key] += 1;
    }
  }

  return (Object.keys(RULE_LABELS) as RuleBreakKey[])
    .map((key) => ({
      key,
      label: RULE_LABELS[key],
      count: counts[key],
    }))
    .sort((a, b) => b.count - a.count);
}
