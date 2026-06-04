/** Journal form copy — international English, simple gold-trader terms. */

export const JOURNAL_FORM_INTRO =
  "Log what matters to you. Panels A–C are optional — add charts anytime (portrait or landscape).";

export const JOURNAL_CHARTS = {
  title: "Chart screenshots",
  description:
    "Before and after shots from phone or desktop. Portrait and landscape both fit — nothing is cropped away.",
} as const;

export const JOURNAL_PANEL_A = {
  badge: "A",
  title: "Quick log",
  description: "~30 seconds: when you traded, side, session, and result in $ and R.",
} as const;

export const JOURNAL_PANEL_B = {
  badge: "B",
  title: "Review & mindset",
  description: "Discipline, setup, emotion, and short notes — for pattern review in Analytics.",
} as const;

export const JOURNAL_PANEL_C = {
  badge: "C",
  title: "Execution detail",
  description: "Entry/exit price and MAE/MFE from your platform — skip if you only track P&L.",
} as const;
