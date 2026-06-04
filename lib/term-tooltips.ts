export const TOOLTIP_TERMS = {
  winRate: "Share of logged trades with positive net P&L (wins ÷ total trades).",
  discipline:
    "Average discipline checklist score (0–100%). Based on following your plan, minimum 1:2 R:R, and a calm mindset.",
  netPnl: "Total net profit or loss in USD across every trade in your journal.",
  netPnlTrade:
    "Net profit or loss for this trade in USD. On mobile, tap Profit or Loss, then enter the amount (no need to type +/−).",
  profitFactor:
    "Gross winning dollars divided by gross losing dollars. Above 1.0 means wins outweigh losses; below 1.0 means the opposite.",
  monthDiscipline: "Average discipline score for trades logged in the current calendar month only.",
  equityCurve:
    "Running total of net P&L after each trade. The line shows how your edge compounds over time (starts at $0 cumulative).",
  recentTrades:
    "Your latest journal entries with session, R-multiple, discipline, emotion, and setup — tap a row to open full notes in History.",
  sessionPnl:
    "Net P&L summed by session tag: Sydney, Tokyo, London, and New York.",
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
  mae: "MAE — maximum floating loss while the trade was open ($), from your platform. Shows how far price moved against you before exit (optional).",
  mfe: "MFE — maximum floating profit while the trade was open ($) before exit. Shows how well the trade ran before price reversed (optional).",
  rMultiple:
    "Result in R (vs. risk per trade). Type +3 or -1 only; the app adds “R” on save (+2R = two times your risk in profit).",
  disciplineShort: "Discipline checklist score for that trade: 0%, 33%, 66%, or 100% (three yes/no items).",
  tradeType: "Trade direction: Buy (long) or Sell (short).",
  session: "Session when you entered: Sydney, Tokyo, London, or New York — tag this on each journal entry.",
  netShort: "Net profit or loss for that single trade in USD (after costs you entered).",
  emotion: "Mindset tag (Calm, FOMO, etc.) — useful for spotting when emotions hurt performance.",
  setup: "Setup tag from your journal (e.g. Liquidity Sweep, FVG) — first tag shown when you use several.",
  holdTime: "Minutes between entry and exit for that trade.",
  performanceOverview: "High-level snapshot: KPIs, equity curve, recent trades, calendar, and analytics in one scroll.",
  disciplineChecklist:
    "Three yes/no checks before you save: followed plan, at least 1:2 R:R, and calm mindset. They set your 0–100% discipline score.",
  followedPlan: "Yes if the entry matched your written strategy rules — not a discretionary override.",
  riskRewardRule: "Yes if the trade targeted at least 1:2 reward versus the dollars you risked before entry.",
  calmMindsetRule: "Yes if you were calm with no FOMO, revenge trading, or overlot urge at entry.",
  reflectionNotes:
    "Optional post-trade notes. Honest, short entries make History reviews far more useful over time.",
  noteContext: "What price action or narrative justified the trade — liquidity, structure, session, etc.",
  noteMistake: 'Process or execution error on this trade, or write "none" if you followed plan.',
  noteNextAction: "One concrete habit or rule for your next session — keeps the journal actionable.",
  tradeDate: "Calendar date of the trade (entry day). Used for calendar P&L and sorting in History.",
  entryTime: "Local time you opened the position. With exit time, powers hold duration and heatmaps.",
  exitTime: "Local time you closed. Leave empty only if still open; pairs with entry time for hold minutes.",
  entryPrice: "XAUUSD spot price at entry (e.g. 4448). Reference alongside net P&L you enter.",
  exitPrice: "XAUUSD spot at exit. Required when the trade is closed.",
  setupTags: "Tap every pattern that applied. Analytics use the first tag when you select several.",
  chartBefore: "Screenshot before entry — plan, levels, or context. Upload a file or paste an https image URL.",
  chartAfter: "Screenshot after exit — outcome and what you learned. Optional but great for Gallery.",
  instrument: "XAURite focuses on spot XAUUSD (gold) so every log stays comparable.",
} as const;

export type TooltipTerm = keyof typeof TOOLTIP_TERMS;

export function getTooltipText(term: TooltipTerm): string {
  return TOOLTIP_TERMS[term];
}
