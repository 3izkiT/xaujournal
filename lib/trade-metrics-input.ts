/** Parse & format Net P&L and R-multiple for journal forms (mobile-friendly). */

export type PnlSign = "profit" | "loss";

export function splitPnlForInput(value: string | number): { sign: PnlSign; amount: string } {
  const n = typeof value === "number" ? value : parseSignedAmountInput(value);
  if (n == null || !Number.isFinite(n)) {
    const trimmed = String(value).trim();
    if (trimmed.startsWith("-")) return { sign: "loss", amount: trimmed.replace(/^-/, "") || "0" };
    return { sign: "profit", amount: trimmed.replace(/^\+/, "") || "0" };
  }
  if (n < 0) return { sign: "loss", amount: formatAmountDigits(Math.abs(n)) };
  return { sign: "profit", amount: formatAmountDigits(n) };
}

export function pnlFromSignAndAmount(sign: PnlSign, amount: string): string {
  const cleaned = amount.replace(/,/g, "").trim();
  if (!cleaned || cleaned === ".") return "0";
  const n = parseFloat(cleaned);
  const abs = Number.isFinite(n) ? Math.abs(n) : 0;
  const signed = sign === "loss" ? -abs : abs;
  return formatAmountDigits(signed);
}

export function parseSignedAmountInput(raw: string): number | null {
  const s = raw.trim().replace(/,/g, "").replace(/\s/g, "");
  if (!s || s === "+" || s === "-") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function formatAmountDigits(n: number): string {
  if (!Number.isFinite(n)) return "0";
  const rounded = Math.round(n * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  return String(rounded);
}

/** Strip trailing R for editing; keeps optional leading +/- and digits. */
export function rMultipleForEdit(stored: string): string {
  const trimmed = stored.trim();
  if (!trimmed) return "";
  const withoutR = trimmed.replace(/r$/i, "");
  if (/^[+-]?\d*\.?\d*$/.test(withoutR)) return withoutR;
  const match = withoutR.match(/^([+-]?)(\d*\.?\d*)/);
  if (!match) return withoutR;
  const sign = match[1] || (withoutR.startsWith("-") ? "-" : "+");
  const num = match[2];
  if (!num) return sign === "-" ? "-" : "+";
  return `${sign === "-" ? "-" : sign === "+" ? "+" : "+"}${num}`;
}

/** Allow only +/-, digits, and one decimal while typing (no R). */
export function sanitizeRMultipleDraft(raw: string): string {
  let v = raw.trim().replace(/r/gi, "");
  v = v.replace(/[^\d.+-]/g, "");
  const sign = v.startsWith("-") ? "-" : v.startsWith("+") ? "+" : "";
  const rest = v.replace(/^[+-]/, "");
  const parts = rest.split(".");
  const intPart = parts[0]?.replace(/\D/g, "") ?? "";
  const decPart = parts.length > 1 ? parts.slice(1).join("").replace(/\D/g, "").slice(0, 2) : "";
  const core = parts.length > 1 ? `${intPart}.${decPart}` : intPart;
  if (!sign && !core) return "";
  if (!core) return sign;
  return `${sign}${core}`;
}

/** Store as +3R / -1.5R */
export function formatRMultipleStored(draft: string): string {
  const v = sanitizeRMultipleDraft(draft);
  if (!v || v === "+" || v === "-") return "+0R";
  const n = parseFloat(v);
  if (!Number.isFinite(n)) return "+0R";
  if (n < 0) {
    const abs = formatRNumber(Math.abs(n));
    return `-${abs}R`;
  }
  return `+${formatRNumber(n)}R`;
}

function formatRNumber(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  return String(rounded);
}
