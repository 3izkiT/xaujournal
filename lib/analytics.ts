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

export function getTotalPnl(trades: JournalTrade[]): number {
  return trades.reduce((sum, trade) => sum + trade.netProfitLoss, 0);
}

export function getEquityCurve(trades: JournalTrade[]) {
  const ordered = [...trades].sort((a, b) => a.date.localeCompare(b.date));
  let running = 0;
  return ordered.map((trade) => {
    running += trade.netProfitLoss;
    return {
      date: trade.date.slice(5),
      equity: Number(running.toFixed(2)),
    };
  });
}

export function getSessionPerformance(trades: JournalTrade[]) {
  const sessions: SessionType[] = ["London Session", "New York Session", "Asian Session"];
  return sessions.map((session) => ({
    name: session.replace(" Session", ""),
    value: trades.filter((trade) => trade.session === session).reduce((sum, trade) => sum + trade.netProfitLoss, 0),
  }));
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
