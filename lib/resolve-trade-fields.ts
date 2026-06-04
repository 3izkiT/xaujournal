import { XAU_SPOT_PRICE_MAX, XAU_SPOT_PRICE_MIN } from "@/lib/data";
import { formatRMultipleStored } from "@/lib/trade-metrics-input";

function inSpotRange(n: number): boolean {
  return Number.isFinite(n) && n >= XAU_SPOT_PRICE_MIN && n <= XAU_SPOT_PRICE_MAX;
}

/** Optional entry/exit — use 0 when blank so quick logs still save. */
export function resolveEntryExitPrices(
  entryStr: string,
  exitStr: string
): { entry: number; exit: number; error: string | null } {
  const entryTrim = entryStr.trim();
  const exitTrim = exitStr.trim();

  if (!entryTrim && !exitTrim) {
    return { entry: 0, exit: 0, error: null };
  }

  if (entryTrim && !exitTrim) {
    const entry = Number(entryTrim);
    if (!inSpotRange(entry)) {
      return {
        entry: 0,
        exit: 0,
        error: `Entry price must be between ${XAU_SPOT_PRICE_MIN} and ${XAU_SPOT_PRICE_MAX} (or leave both blank).`,
      };
    }
    return { entry, exit: entry, error: null };
  }

  if (!entryTrim && exitTrim) {
    const exit = Number(exitTrim);
    if (!inSpotRange(exit)) {
      return {
        entry: 0,
        exit: 0,
        error: `Exit price must be between ${XAU_SPOT_PRICE_MIN} and ${XAU_SPOT_PRICE_MAX} (or leave both blank).`,
      };
    }
    return { entry: exit, exit, error: null };
  }

  const entry = Number(entryTrim);
  const exit = Number(exitTrim);
  if (!inSpotRange(entry) || !inSpotRange(exit)) {
    return {
      entry: 0,
      exit: 0,
      error: `Prices must be between ${XAU_SPOT_PRICE_MIN} and ${XAU_SPOT_PRICE_MAX}, or leave both blank.`,
    };
  }
  return { entry, exit, error: null };
}

export function resolveRMultiple(draft: string): string {
  const trimmed = draft.trim();
  if (!trimmed) return "+0R";
  return formatRMultipleStored(trimmed);
}
