/** Recharts & heatmap palette — muted pastels + champagne gold (XAUJournal premium). */
export const XAU_CHART = {
  grid: "#EDEDED",
  tick: "#6B7280",
  zeroLine: "#C5C9D4",
  equityLine: "#C4A84D",
  equityDot: "#E5C158",
  winRate: "#A8C4A0",
  mistakes: "#D4A8A4",
  ruleBreak: "#D4A8A4",
  ruleBreakEmpty: "#EDEDED",
  sessionPositive: ["#A8BFD4", "#A8C4A0", "#E8D7A5"] as const,
  sessionLoss: "#D4A8A4",
  heatmap: {
    empty: "#F9F9FB",
    posStrong: "#D2EBD4",
    posWeak: "#E2F0D9",
    negWeak: "#F6DFDF",
    negStrong: "#FADBD8",
    neutral: "#E1EBF5",
  },
} as const;
