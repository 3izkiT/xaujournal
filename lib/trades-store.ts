import { mockTrades } from "@/lib/data";
import { JournalTrade } from "@/lib/types";

const globalTrades = globalThis as unknown as { xaujournalTrades?: Map<string, JournalTrade[]> };

function getMap(): Map<string, JournalTrade[]> {
  if (!globalTrades.xaujournalTrades) {
    const map = new Map<string, JournalTrade[]>();
    map.set("user-demo", [...mockTrades]);
    globalTrades.xaujournalTrades = map;
  }
  return globalTrades.xaujournalTrades;
}

export function getTradesForUser(userId: string): JournalTrade[] {
  const map = getMap();
  if (!map.has(userId)) {
    map.set(userId, []);
  }
  return map.get(userId) ?? [];
}

export function saveTradesForUser(userId: string, trades: JournalTrade[]) {
  getMap().set(userId, trades);
}

export function addTradeForUser(userId: string, trade: JournalTrade) {
  const current = getTradesForUser(userId);
  saveTradesForUser(userId, [trade, ...current]);
}
