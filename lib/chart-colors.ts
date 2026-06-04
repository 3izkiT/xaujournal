/** TradingView-aligned palette — profit #089981, loss #f23645 */

export type ThemeMode = "light" | "dark";

export type ChartPalette = {
  grid: string;
  tick: string;
  zeroLine: string;
  equityLine: string;
  equityDot: string;
  winRate: string;
  mistakes: string;
  ruleBreak: string;
  ruleBreakEmpty: string;
  sessionPositive: readonly [string, string, string, string];
  sessionLoss: string;
  heatmap: {
    empty: string;
    posStrong: string;
    posWeak: string;
    negWeak: string;
    negStrong: string;
    neutral: string;
  };
};

const TV_PROFIT = "#089981";
const TV_LOSS = "#f23645";

export const CHART_PALETTE: Record<ThemeMode, ChartPalette> = {
  light: {
    grid: "#e0e3eb",
    tick: "#787b86",
    zeroLine: "#b2b5be",
    equityLine: "#2962ff",
    equityDot: "#2962ff",
    winRate: TV_PROFIT,
    mistakes: TV_LOSS,
    ruleBreak: TV_LOSS,
    ruleBreakEmpty: "#e0e3eb",
    sessionPositive: ["#7b68ee", "#2962ff", TV_PROFIT, "#e8d7a5"],
    sessionLoss: TV_LOSS,
    heatmap: {
      empty: "#f0f3fa",
      posStrong: "rgba(8, 153, 129, 0.55)",
      posWeak: "rgba(8, 153, 129, 0.28)",
      negWeak: "rgba(242, 54, 69, 0.28)",
      negStrong: "rgba(242, 54, 69, 0.55)",
      neutral: "#e0e3eb",
    },
  },
  dark: {
    grid: "#2a2e39",
    tick: "#787b86",
    zeroLine: "#434651",
    equityLine: "#2962ff",
    equityDot: "#2962ff",
    winRate: TV_PROFIT,
    mistakes: TV_LOSS,
    ruleBreak: TV_LOSS,
    ruleBreakEmpty: "#2a2e39",
    sessionPositive: ["#7b68ee", "#2962ff", TV_PROFIT, "#d4af37"],
    sessionLoss: TV_LOSS,
    heatmap: {
      empty: "#1e222d",
      posStrong: "rgba(8, 153, 129, 0.65)",
      posWeak: "rgba(8, 153, 129, 0.35)",
      negWeak: "rgba(242, 54, 69, 0.35)",
      negStrong: "rgba(242, 54, 69, 0.65)",
      neutral: "#2a2e39",
    },
  },
};

export function getChartPalette(mode: ThemeMode): ChartPalette {
  return CHART_PALETTE[mode];
}

/** @deprecated Use getChartPalette via useChartPalette — kept for gradual migration */
export const XAU_CHART = CHART_PALETTE.light;
