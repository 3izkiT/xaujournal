/**
 * XAUUSD trading sessions (Thailand time / ICT for journal tagging).
 */
export const TRADING_SESSIONS = [
  {
    id: "Sydney Session",
    shortName: "Sydney",
    market: "ตลาดซิดนีย์",
    description: "เริ่มต้นวันใหม่ของตลาด",
    thaiTime: "05:00 – 14:00",
  },
  {
    id: "Tokyo Session",
    shortName: "Tokyo",
    market: "ตลาดโตเกียว",
    description: "ช่วงตลาดเอเชีย สภาพคล่องระดับปานกลาง",
    thaiTime: "07:00 – 16:00",
  },
  {
    id: "London Session",
    shortName: "London",
    market: "ตลาดลอนดอน",
    description: "ตลาดที่ใหญ่และมีความผันผวนสูงมาก",
    thaiTime: "14:00 – 23:00",
  },
  {
    id: "New York Session",
    shortName: "New York",
    market: "ตลาดนิวยอร์ก",
    description: "ตลาดฝั่งอเมริกาที่ปริมาณการซื้อขายหนาแน่น",
    thaiTime: "20:00 – 05:00",
  },
] as const;

export type SessionType = (typeof TRADING_SESSIONS)[number]["id"];

export const sessionOptions: SessionType[] = TRADING_SESSIONS.map((s) => s.id);

export const SESSION_SELECT_HINT =
  "Thailand time (ICT): Sydney 05:00–14:00 · Tokyo 07:00–16:00 · London 14:00–23:00 · New York 20:00–05:00";

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
  return `${meta.shortName} (${meta.thaiTime} น.)`;
}
