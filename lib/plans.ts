import { Plan } from "@prisma/client";

export const FREE_TRADE_LIMIT = 10;

export function isPremiumPlan(plan: Plan): boolean {
  return plan === Plan.PREMIUM_GOLD;
}

export function getTradeLimit(plan: Plan): number | null {
  return isPremiumPlan(plan) ? null : FREE_TRADE_LIMIT;
}
