export const TOOLTIP_TERMS = {
  winRate: "Share of logged trades with positive net P&L (wins ÷ total trades).",
  discipline:
    "Average discipline checklist score (0–100%). Based on following your plan, minimum 1:2 R:R, and a calm mindset.",
  netPnl: "Total net profit or loss in USD across every trade in your journal.",
  profitFactor:
    "Gross winning dollars divided by gross losing dollars. Above 1.0 means wins outweigh losses; below 1.0 means the opposite.",
  monthDiscipline: "Average discipline score for trades logged in the current calendar month only.",
  equityCurve:
    "Running total of net P&L after each trade. The line shows how your edge compounds over time (starts at $0 cumulative).",
  recentTrades:
    "Your latest journal entries with session, R-multiple, discipline, emotion, and setup — tap a row to open full notes in History.",
  sessionPnl:
    "Net P&L summed by session tag: London, New York, or Asian. Helps you see where your edge shows up.",
  tradeCalendar:
    "Each day shows combined net P&L for all trades on that date. Green = profitable day, red = losing day. Tap a day to open History.",
  analytics:
    "Deeper breakdowns: setup quality, how long you hold, MAE/MFE, which rules you break, and when you trade best.",
  setupWinRate:
    "Per setup tag: win rate (%) and how many trades you flagged as mistakes. Tag setups on journal entries to populate this.",
  ruleBreakTracker:
    "Counts how often each discipline checklist item was left unchecked — your most broken rules.",
  dayHourHeatmap:
    "Net P&L by weekday and hour of entry (your local time). Darker green/red = stronger result; empty = no trades.",
  avgHoldTime: "Average minutes between entry and exit, for trades where both times are logged.",
  mae: "Maximum Adverse Excursion — the largest unrealized loss in dollars while the trade was open.",
  mfe: "Maximum Favorable Excursion — the largest unrealized profit in dollars while the trade was open.",
  rMultiple:
    "Result in R units (your planned risk). Example: +2R means profit equal to twice the dollars you risked on the trade.",
  disciplineShort: "Discipline checklist score for that trade: 0%, 33%, 66%, or 100% (three yes/no items).",
  tradeType: "Trade direction: Buy (long) or Sell (short).",
  session: "Session when you entered: London, New York, or Asian — tag this on each journal entry.",
  netShort: "Net profit or loss for that single trade in USD (after costs you entered).",
  emotion: "Mindset tag (Calm, FOMO, etc.) — useful for spotting when emotions hurt performance.",
  setup: "Setup tag from your journal (e.g. Liquidity Sweep, FVG) — first tag shown when you use several.",
  holdTime: "Minutes between entry and exit for that trade.",
  performanceOverview: "High-level snapshot: KPIs, equity curve, recent trades, calendar, and analytics in one scroll.",
} as const;

export type TooltipTerm = keyof typeof TOOLTIP_TERMS;

export function getTooltipText(term: TooltipTerm): string {
  return TOOLTIP_TERMS[term];
}
