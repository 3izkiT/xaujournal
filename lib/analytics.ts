import { normalizeSessionLabel } from "@/lib/sessions";
import { JournalTrade, SessionType, SetupTag } from "@/lib/types";

export function getWinRate(trades: JournalTrade[]): number {
  if (!trades.length) return 0;
  const wins = trades.filter((trade) => trade.netProfitLoss > 0).length;
  return Math.round((wins / trades.length) * 100);
}

export function getAverageDisciplineScore(trades: JournalTrade[]): number {
  if (!trades.length) return 0;
  const total = trades.reduce((sum, trade) => sum + trade.disciplineScore, 0);
  return Math.round(total / trades.length);
}

export function getMonthlyDisciplineScore(trades: JournalTrade[], reference = new Date()): number {
  const month = reference.getMonth();
  const year = reference.getFullYear();
  const monthly = trades.filter((trade) => {
    const d = new Date(trade.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });
  return getAverageDisciplineScore(monthly);
}

export function getProfitFactor(trades: JournalTrade[]): number {
  const grossProfit = trades.filter((t) => t.netProfitLoss > 0).reduce((s, t) => s + t.netProfitLoss, 0);
  const grossLoss = Math.abs(trades.filter((t) => t.netProfitLoss < 0).reduce((s, t) => s + t.netProfitLoss, 0));
  if (grossLoss === 0) return grossProfit > 0 ? 99.99 : 0;
  return Number((grossProfit / grossLoss).toFixed(2));
}

export function getTotalPnl(trades: JournalTrade[]): number {
  return trades.reduce((sum, trade) => sum + trade.netProfitLoss, 0);
}

export function getEquityCurve(trades: JournalTrade[]) {
  const ordered = [...trades].sort((a, b) => a.date.localeCompare(b.date));
  let running = 0;

  const points = ordered.map((trade, index) => {
    running += trade.netProfitLoss;
    const d = new Date(trade.date);
    const shortDate = trade.date.slice(5);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return {
      date: shortDate,
      label,
      tradeIndex: index + 1,
      equity: Number(running.toFixed(2)),
      change: trade.netProfitLoss,
    };
  });

  return [{ date: "Start", label: "Start", tradeIndex: 0, equity: 0, change: 0 }, ...points];
}

export function getSessionPerformance(trades: JournalTrade[]) {
  const sessions: SessionType[] = [
    "Sydney Session",
    "Tokyo Session",
    "London Session",
    "New York Session",
  ];
  return sessions.map((session) => ({
    name: session.replace(" Session", ""),
    value: trades
      .filter((trade) => normalizeSessionLabel(trade.session) === session)
      .reduce((sum, trade) => sum + trade.netProfitLoss, 0),
  }));
}

export function getAverageHoldTimeMinutes(trades: JournalTrade[]): number | null {
  const withHold = trades.filter((t) => t.holdTimeMinutes != null && t.holdTimeMinutes > 0);
  if (!withHold.length) return null;
  const total = withHold.reduce((sum, t) => sum + (t.holdTimeMinutes ?? 0), 0);
  return Math.round(total / withHold.length);
}

export function getAverageMaeMfe(trades: JournalTrade[]) {
  const withMae = trades.filter((t) => t.mae != null);
  const withMfe = trades.filter((t) => t.mfe != null);
  const avg = (values: number[]) =>
    values.length ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)) : null;
  return {
    avgMae: avg(withMae.map((t) => t.mae!)),
    avgMfe: avg(withMfe.map((t) => t.mfe!)),
  };
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function weekdayIndex(date: Date) {
  return (date.getDay() + 6) % 7;
}

export function getDayHourHeatmap(trades: JournalTrade[]) {
  const cells: { day: string; hour: number; pnl: number; count: number }[] = [];
  for (let d = 0; d < 7; d += 1) {
    for (let h = 0; h < 24; h += 1) {
      cells.push({ day: DAY_LABELS[d], hour: h, pnl: 0, count: 0 });
    }
  }

  for (const trade of trades) {
    const at = new Date(trade.entryAt || trade.date);
    const d = weekdayIndex(at);
    const h = at.getHours();
    const idx = d * 24 + h;
    cells[idx].pnl += trade.netProfitLoss;
    cells[idx].count += 1;
  }

  return cells;
}

export function getSetupWinRateVsMistakes(trades: JournalTrade[]) {
  const setupTags: SetupTag[] = ["Liquidity Sweep", "FVG Mitigation", "Break of Structure", "Order Block"];
  const negativeEmotions = new Set(["Revenge Trading", "Overlot", "FOMO", "Fear", "Greed"]);

  return setupTags.map((setup) => {
    const filtered = trades.filter((trade) => trade.setupTags.includes(setup));
    const wins = filtered.filter((trade) => trade.netProfitLoss > 0).length;
    const winRate = filtered.length ? Math.round((wins / filtered.length) * 100) : 0;
    const mistakes = filtered.filter((trade) => negativeEmotions.has(trade.emotion)).length;
    return {
      setup: setup.replace("Break of Structure", "BOS"),
      winRate,
      mistakes,
    };
  });
}
