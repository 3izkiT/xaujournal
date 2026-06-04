/**
 * XAUUSD trading sessions (ICT / Thailand time reference for journal tags).
 */
export const TRADING_SESSIONS = [
  {
    id: "Sydney Session",
    shortName: "Sydney",
    market: "Sydney",
    description: "Opens the trading day — liquidity builds into Asia.",
    ictRange: "05:00 – 14:00",
  },
  {
    id: "Tokyo Session",
    shortName: "Tokyo",
    market: "Tokyo",
    description: "Asia session — moderate liquidity, often sets tone for London.",
    ictRange: "07:00 – 16:00",
  },
  {
    id: "London Session",
    shortName: "London",
    market: "London",
    description: "Major session — high volatility and volume.",
    ictRange: "14:00 – 23:00",
  },
  {
    id: "New York Session",
    shortName: "New York",
    market: "New York",
    description: "US session — dense volume, often drives late-day direction.",
    ictRange: "20:00 – 05:00",
  },
] as const;

export type SessionType = (typeof TRADING_SESSIONS)[number]["id"];

export const sessionOptions: SessionType[] = TRADING_SESSIONS.map((s) => s.id);

export const SESSION_SELECT_HINT =
  "ICT (Thailand time): Sydney 05:00–14:00 · Tokyo 07:00–16:00 · London 14:00–23:00 · New York 20:00–05:00";

const LEGACY_SESSION_MAP: Record<string, SessionType> = {
  "Asian Session": "Tokyo Session",
};

export function normalizeSessionLabel(session: string): SessionType {
  if (session in LEGACY_SESSION_MAP) {
    return LEGACY_SESSION_MAP[session];
  }
  if (sessionOptions.includes(session as SessionType)) {
    return session as SessionType;
  }
  return "London Session";
}

export function sessionShortName(session: SessionType | string): string {
  const normalized = normalizeSessionLabel(session);
  const meta = TRADING_SESSIONS.find((s) => s.id === normalized);
  return meta?.shortName ?? normalized.replace(" Session", "");
}

export function sessionMeta(session: SessionType | string) {
  const normalized = normalizeSessionLabel(session);
  return TRADING_SESSIONS.find((s) => s.id === normalized) ?? TRADING_SESSIONS[2];
}

export function sessionChartSubtitle(): string {
  return TRADING_SESSIONS.map((s) => s.shortName).join(" · ");
}

export function sessionSelectLabel(session: SessionType): string {
  const meta = sessionMeta(session);
  return `${meta.shortName} (${meta.ictRange} ICT)`;
}
