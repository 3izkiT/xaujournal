import { Plan } from "@prisma/client";
import { getTradeLimit, isPremiumPlan } from "@/lib/plans";

/**
 * Growth phase: full product free, payments UI hidden.
 * Flip via env when ready to monetize.
 */
export const OPEN_ACCESS_MODE = process.env.NEXT_PUBLIC_OPEN_ACCESS_MODE !== "false";

export const PAYMENTS_ENABLED = process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === "true";

export const ADSENSE_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

export const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "";

/** Treat every user as premium (unlimited logs, full analytics). */
export function isOpenAccessActive() {
  return OPEN_ACCESS_MODE;
}

export function effectiveTradeLimit(plan: Plan): number | null {
  if (isOpenAccessActive()) return null;
  return getTradeLimit(plan);
}

export function effectiveIsPremium(plan: Plan): boolean {
  if (isOpenAccessActive()) return true;
  return isPremiumPlan(plan);
}

export function canAddMoreTrades(plan: Plan, tradeCount: number): boolean {
  const limit = effectiveTradeLimit(plan);
  return limit == null || tradeCount < limit;
}
