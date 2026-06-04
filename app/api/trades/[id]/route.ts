import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/app-session";
import { afterPlaceholder, beforePlaceholder, sanitizeChartUrl } from "@/lib/chart-upload";
import { calculateDisciplineScore } from "@/lib/data";
import { isDatabaseConfigured } from "@/lib/db";
import { canAddMoreTrades, effectiveTradeLimit, isOpenAccessActive } from "@/lib/monetization";
import {
  countTradesForUser,
  deleteTradeForUser,
  getTradesForUser,
  getUserPlan,
  updateTradeForUser,
} from "@/lib/trades-store";
import { JournalTrade } from "@/lib/types";
import { validateTradeNotes } from "@/lib/validate-trade";
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

export async function PATCH(request: Request, context: RouteContext) {
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
    const body = await request.json();
    const noteError = validateTradeNotes(body);
    if (noteError) {
      return NextResponse.json({ error: noteError }, { status: 400 });
    }

    let beforeChartUrl: string;
    let afterChartUrl: string;
    try {
      beforeChartUrl = sanitizeChartUrl(body.beforeChartUrl, beforePlaceholder);
      afterChartUrl = sanitizeChartUrl(body.afterChartUrl, afterPlaceholder);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid chart image.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const disciplineChecklist = body.disciplineChecklist;
    const disciplineScore = calculateDisciplineScore(disciplineChecklist);
    const entryAt = body.entryAt ? new Date(body.entryAt).toISOString() : new Date(`${body.date}T12:00:00`).toISOString();
    const exitAt = body.exitAt ? new Date(body.exitAt).toISOString() : null;

    const trade: JournalTrade = {
      id,
      asset: "XAUUSD (Gold)",
      date: body.date,
      entryAt,
      exitAt,
      holdTimeMinutes: body.holdTimeMinutes != null ? Number(body.holdTimeMinutes) : null,
      type: body.type,
      netProfitLoss: Number(body.netProfitLoss),
      rMultiple: body.rMultiple,
      entryPrice: Number(body.entryPrice),
      exitPrice: Number(body.exitPrice),
      mae: body.mae != null && body.mae !== "" ? Number(body.mae) : null,
      mfe: body.mfe != null && body.mfe !== "" ? Number(body.mfe) : null,
      session: body.session,
      setupTags: body.setupTags,
      emotion: body.emotion,
      beforeChartUrl,
      afterChartUrl,
      disciplineChecklist,
      disciplineScore,
      noteContext: body.noteContext,
      noteMistake: body.noteMistake,
      noteNextAction: body.noteNextAction,
    };

    const updated = await updateTradeForUser(session.userId, id, trade);
    if (!updated) {
      return NextResponse.json({ error: "Trade not found." }, { status: 404 });
    }

    const [trades, meta] = await Promise.all([getTradesForUser(session.userId), journalMeta(session.userId)]);
    return NextResponse.json({ trades, ...meta });
  } catch {
    return NextResponse.json({ error: "Failed to update trade." }, { status: 500 });
  }
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
