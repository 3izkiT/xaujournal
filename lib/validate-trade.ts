import {
  emotionOptions,
  sessionOptions,
  tradeTypeOptions,
  XAU_SPOT_PRICE_MAX,
  XAU_SPOT_PRICE_MIN,
} from "@/lib/data";
import type { DisciplineChecklist, EmotionType, JournalTrade, SessionType, TradeType } from "@/lib/types";

const MIN_NOTE_LEN = 3;

/** Reflection notes are optional; if you start a field, finish it (min 3 chars). */
export function validateTradeNotes(notes: {
  noteContext?: string;
  noteMistake?: string;
  noteNextAction?: string;
}): string | null {
  const fields = [
    { key: "Context", value: notes.noteContext?.trim() ?? "" },
    { key: "Mistake", value: notes.noteMistake?.trim() ?? "" },
    { key: "Next action", value: notes.noteNextAction?.trim() ?? "" },
  ];

  for (const field of fields) {
    if (field.value.length > 0 && field.value.length < MIN_NOTE_LEN) {
      return `${field.key} note must be at least ${MIN_NOTE_LEN} characters (or leave it empty).`;
    }
  }
  return null;
}

function isValidDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T12:00:00`);
  return !Number.isNaN(d.getTime());
}

function isValidIsoDate(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

export type TradeInput = Partial<
  Pick<
    JournalTrade,
    | "date"
    | "entryAt"
    | "exitAt"
    | "holdTimeMinutes"
    | "type"
    | "netProfitLoss"
    | "rMultiple"
    | "entryPrice"
    | "exitPrice"
    | "mae"
    | "mfe"
    | "session"
    | "setupTags"
    | "emotion"
    | "disciplineChecklist"
    | "noteContext"
    | "noteMistake"
    | "noteNextAction"
  >
>;

export function validateTradeInput(body: TradeInput, { partial = false }: { partial?: boolean } = {}): string | null {
  if (!partial) {
    if (!isValidDate(body.date)) return "Enter a valid trade date (YYYY-MM-DD).";
    if (body.entryAt != null && !isValidIsoDate(body.entryAt)) return "Enter a valid entry time.";
    if (body.exitAt != null && body.exitAt !== "" && !isValidIsoDate(body.exitAt)) return "Enter a valid exit time.";
    if (!body.type || !tradeTypeOptions.includes(body.type as TradeType)) return "Select a valid trade direction.";
    if (!body.session || !sessionOptions.includes(body.session as SessionType)) return "Select a valid session.";
    if (!body.emotion || !emotionOptions.includes(body.emotion as EmotionType)) return "Select a valid emotion tag.";
    if (!Array.isArray(body.setupTags) || body.setupTags.length === 0) {
      return "Select at least one setup tag.";
    }
    if (body.setupTags.some((tag) => typeof tag !== "string" || !tag.trim())) {
      return "Setup tags must be non-empty strings.";
    }

    const entry = Number(body.entryPrice);
    const exit = Number(body.exitPrice);
    if (!Number.isFinite(entry) || entry < XAU_SPOT_PRICE_MIN || entry > XAU_SPOT_PRICE_MAX) {
      return `Enter a valid entry price (${XAU_SPOT_PRICE_MIN}–${XAU_SPOT_PRICE_MAX}).`;
    }
    if (!Number.isFinite(exit) || exit < XAU_SPOT_PRICE_MIN || exit > XAU_SPOT_PRICE_MAX) {
      return `Enter a valid exit price (${XAU_SPOT_PRICE_MIN}–${XAU_SPOT_PRICE_MAX}).`;
    }

    const pnl = Number(body.netProfitLoss);
    if (!Number.isFinite(pnl)) return "Enter a valid net profit/loss amount.";

    if (typeof body.rMultiple !== "string" || !body.rMultiple.trim()) {
      return "Enter a valid R-multiple.";
    }

    const checklist = body.disciplineChecklist as DisciplineChecklist | undefined;
    if (
      !checklist ||
      typeof checklist.followedPlan !== "boolean" ||
      typeof checklist.rrAtLeastOneToTwo !== "boolean" ||
      typeof checklist.calmMindset !== "boolean"
    ) {
      return "Complete the discipline checklist.";
    }
  } else {
    if (body.date != null && !isValidDate(body.date)) return "Enter a valid trade date (YYYY-MM-DD).";
    if (body.entryAt != null && !isValidIsoDate(body.entryAt)) return "Enter a valid entry time.";
    if (body.exitAt != null && body.exitAt !== "" && body.exitAt != null && !isValidIsoDate(body.exitAt)) {
      return "Enter a valid exit time.";
    }
    if (body.type != null && !tradeTypeOptions.includes(body.type as TradeType)) return "Select a valid trade direction.";
    if (body.session != null && !sessionOptions.includes(body.session as SessionType)) return "Select a valid session.";
    if (body.emotion != null && !emotionOptions.includes(body.emotion as EmotionType)) return "Select a valid emotion tag.";
    if (body.setupTags != null) {
      if (!Array.isArray(body.setupTags) || body.setupTags.length === 0) return "Select at least one setup tag.";
      if (body.setupTags.some((tag) => typeof tag !== "string" || !tag.trim())) {
        return "Setup tags must be non-empty strings.";
      }
    }
    if (body.entryPrice != null) {
      const entry = Number(body.entryPrice);
      if (!Number.isFinite(entry) || entry < XAU_SPOT_PRICE_MIN || entry > XAU_SPOT_PRICE_MAX) {
        return `Enter a valid entry price (${XAU_SPOT_PRICE_MIN}–${XAU_SPOT_PRICE_MAX}).`;
      }
    }
    if (body.exitPrice != null) {
      const exit = Number(body.exitPrice);
      if (!Number.isFinite(exit) || exit < XAU_SPOT_PRICE_MIN || exit > XAU_SPOT_PRICE_MAX) {
        return `Enter a valid exit price (${XAU_SPOT_PRICE_MIN}–${XAU_SPOT_PRICE_MAX}).`;
      }
    }
    if (body.netProfitLoss != null && !Number.isFinite(Number(body.netProfitLoss))) {
      return "Enter a valid net profit/loss amount.";
    }
    if (body.rMultiple != null && (typeof body.rMultiple !== "string" || !body.rMultiple.trim())) {
      return "Enter a valid R-multiple.";
    }
    if (body.disciplineChecklist != null) {
      const checklist = body.disciplineChecklist as DisciplineChecklist;
      if (
        typeof checklist.followedPlan !== "boolean" ||
        typeof checklist.rrAtLeastOneToTwo !== "boolean" ||
        typeof checklist.calmMindset !== "boolean"
      ) {
        return "Complete the discipline checklist.";
      }
    }
  }

  return validateTradeNotes(body);
}
