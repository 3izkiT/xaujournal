import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/app-session";
import { isDatabaseConfigured } from "@/lib/db";
import {
  countTradesForUser,
  deleteTradeForUser,
  getTradeForUser,
  getTradesForUser,
  getUserPlan,
  updateTradeForUser,
} from "@/lib/trades-store";
import { canAddMoreTrades, effectiveTradeLimit, isOpenAccessActive } from "@/lib/monetization";
import { afterPlaceholder, beforePlaceholder, sanitizeChartUrl } from "@/lib/chart-upload";
import { calculateDisciplineScore } from "@/lib/data";
import { JournalTrade } from "@/lib/types";
import { validateTradeInput } from "@/lib/validate-trade";
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

function mergeTrade(existing: JournalTrade, body: Record<string, unknown>): JournalTrade {
  const disciplineChecklist = (body.disciplineChecklist as JournalTrade["disciplineChecklist"]) ?? existing.disciplineChecklist;
  const entryAt = body.entryAt
    ? new Date(String(body.entryAt)).toISOString()
    : body.date
      ? new Date(`${String(body.date)}T12:00:00`).toISOString()
      : existing.entryAt;
  const exitAt =
    body.exitAt === null
      ? null
      : body.exitAt
        ? new Date(String(body.exitAt)).toISOString()
        : existing.exitAt;

  return {
    ...existing,
    date: body.date != null ? String(body.date) : existing.date,
    entryAt,
    exitAt,
    holdTimeMinutes:
      body.holdTimeMinutes != null ? Number(body.holdTimeMinutes) : existing.holdTimeMinutes,
    type: (body.type as JournalTrade["type"]) ?? existing.type,
    netProfitLoss: body.netProfitLoss != null ? Number(body.netProfitLoss) : existing.netProfitLoss,
    rMultiple: body.rMultiple != null ? String(body.rMultiple) : existing.rMultiple,
    entryPrice: body.entryPrice != null ? Number(body.entryPrice) : existing.entryPrice,
    exitPrice: body.exitPrice != null ? Number(body.exitPrice) : existing.exitPrice,
    mae: body.mae !== undefined ? (body.mae === "" || body.mae == null ? null : Number(body.mae)) : existing.mae,
    mfe: body.mfe !== undefined ? (body.mfe === "" || body.mfe == null ? null : Number(body.mfe)) : existing.mfe,
    session: (body.session as JournalTrade["session"]) ?? existing.session,
    setupTags: (body.setupTags as JournalTrade["setupTags"]) ?? existing.setupTags,
    emotion: (body.emotion as JournalTrade["emotion"]) ?? existing.emotion,
    beforeChartUrl: body.beforeChartUrl != null ? String(body.beforeChartUrl) : existing.beforeChartUrl,
    afterChartUrl: body.afterChartUrl != null ? String(body.afterChartUrl) : existing.afterChartUrl,
    disciplineChecklist,
    disciplineScore: calculateDisciplineScore(disciplineChecklist),
    noteContext: body.noteContext != null ? String(body.noteContext) : existing.noteContext,
    noteMistake: body.noteMistake != null ? String(body.noteMistake) : existing.noteMistake,
    noteNextAction: body.noteNextAction != null ? String(body.noteNextAction) : existing.noteNextAction,
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
    const existing = await getTradeForUser(session.userId, id);
    if (!existing) {
      return NextResponse.json({ error: "Trade not found." }, { status: 404 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const merged = mergeTrade(existing, body);

    let beforeChartUrl = merged.beforeChartUrl;
    let afterChartUrl = merged.afterChartUrl;
    if (body.beforeChartUrl !== undefined) {
      beforeChartUrl = sanitizeChartUrl(body.beforeChartUrl, beforePlaceholder);
    }
    if (body.afterChartUrl !== undefined) {
      afterChartUrl = sanitizeChartUrl(body.afterChartUrl, afterPlaceholder);
    }

    const trade: JournalTrade = { ...merged, beforeChartUrl, afterChartUrl };
    const validationError = validateTradeInput(trade);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const updated = await updateTradeForUser(session.userId, id, trade);
    if (!updated) {
      return NextResponse.json({ error: "Trade not found." }, { status: 404 });
    }

    const [trades, meta] = await Promise.all([getTradesForUser(session.userId), journalMeta(session.userId)]);
    return NextResponse.json({ trades, ...meta });
  } catch (err) {
    console.error("[trades PATCH]", err);
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
  } catch (err) {
    console.error("[trades DELETE]", err);
    return NextResponse.json({ error: "Failed to delete trade." }, { status: 500 });
  }
}
