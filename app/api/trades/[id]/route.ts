import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/app-session";
import { isDatabaseConfigured } from "@/lib/db";
import {
  countTradesForUser,
  deleteTradeForUser,
  getTradesForUser,
  getUserPlan,
} from "@/lib/trades-store";
import { canAddMoreTrades, effectiveTradeLimit, isOpenAccessActive } from "@/lib/monetization";
import { Plan } from "@prisma/client";

type RouteContext = { params: Promise<{ id: string }> };

async function journalMeta(userId: string) {
  const [plan, tradeCount] = await Promise.all([getUserPlan(userId), countTradesForUser(userId)]);
  const tradeLimit = effectiveTradeLimit(plan);
  return {
    plan: plan as Plan,
    tradeCount,
    tradeLimit,
    canAddMore: canAddMoreTrades(plan, tradeCount),
    openAccess: isOpenAccessActive(),
  };
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!isDatabaseConfigured) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  const session = await getAppSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id?.trim()) {
    return NextResponse.json({ error: "Missing trade id." }, { status: 400 });
  }

  try {
    const deleted = await deleteTradeForUser(session.userId, id);
    if (!deleted) {
      return NextResponse.json({ error: "Trade not found." }, { status: 404 });
    }

    const [trades, meta] = await Promise.all([getTradesForUser(session.userId), journalMeta(session.userId)]);
    return NextResponse.json({ trades, ...meta });
  } catch {
    return NextResponse.json({ error: "Failed to delete trade." }, { status: 500 });
  }
}
