import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/app-session";
import { calculateDisciplineScore } from "@/lib/data";
import { isDatabaseConfigured } from "@/lib/db";
import { canAddMoreTrades, effectiveTradeLimit, isOpenAccessActive } from "@/lib/monetization";
import { FREE_TRADE_LIMIT } from "@/lib/plans";
import { addTradeForUser, countTradesForUser, getTradesForUser, getUserPlan } from "@/lib/trades-store";
import { JournalTrade } from "@/lib/types";
import { afterPlaceholder, beforePlaceholder, sanitizeChartUrl } from "@/lib/chart-upload";
import { validateTradeInput } from "@/lib/validate-trade";
import { Plan } from "@prisma/client";

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

function buildTradeFromBody(body: Record<string, unknown>, existingId?: string): JournalTrade {
  const disciplineChecklist = body.disciplineChecklist as JournalTrade["disciplineChecklist"];
  const disciplineScore = calculateDisciplineScore(disciplineChecklist);
  const entryAt = body.entryAt
    ? new Date(String(body.entryAt)).toISOString()
    : new Date(`${String(body.date)}T12:00:00`).toISOString();
  const exitAt = body.exitAt ? new Date(String(body.exitAt)).toISOString() : null;

  return {
    id: existingId ?? `t-${Date.now()}`,
    asset: "XAUUSD (Gold)",
    date: String(body.date),
    entryAt,
    exitAt,
    holdTimeMinutes: body.holdTimeMinutes != null ? Number(body.holdTimeMinutes) : null,
    type: body.type as JournalTrade["type"],
    netProfitLoss: Number(body.netProfitLoss),
    rMultiple: String(body.rMultiple),
    entryPrice: Number(body.entryPrice),
    exitPrice: Number(body.exitPrice),
    mae: body.mae != null && body.mae !== "" ? Number(body.mae) : null,
    mfe: body.mfe != null && body.mfe !== "" ? Number(body.mfe) : null,
    session: body.session as JournalTrade["session"],
    setupTags: body.setupTags as JournalTrade["setupTags"],
    emotion: body.emotion as JournalTrade["emotion"],
    beforeChartUrl: String(body.beforeChartUrl),
    afterChartUrl: String(body.afterChartUrl),
    disciplineChecklist,
    disciplineScore,
    noteContext: String(body.noteContext ?? ""),
    noteMistake: String(body.noteMistake ?? ""),
    noteNextAction: String(body.noteNextAction ?? ""),
  };
}

export async function GET() {
  if (!isDatabaseConfigured) {
    return NextResponse.json(
      { error: "Database is not configured. Please set DATABASE_URL." },
      { status: 503 }
    );
  }

  try {
    const session = await getAppSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [trades, meta] = await Promise.all([
      getTradesForUser(session.userId),
      journalMeta(session.userId),
    ]);

    return NextResponse.json({ trades, ...meta });
  } catch (err) {
    console.error("[trades GET]", err);
    return NextResponse.json({ error: "Failed to load trades." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured) {
    return NextResponse.json(
      { error: "Database is not configured. Please set DATABASE_URL." },
      { status: 503 }
    );
  }

  const session = await getAppSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const meta = await journalMeta(session.userId);
    if (!meta.canAddMore) {
      return NextResponse.json(
        {
          error: isOpenAccessActive()
            ? "Trade limit reached. Please contact support."
            : `Free tier limit reached (${FREE_TRADE_LIMIT} logs). Upgrade to Premium for unlimited logs.`,
          code: "TRADE_LIMIT_REACHED",
          ...meta,
        },
        { status: 403 }
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const validationError = validateTradeInput(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
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

    const trade = buildTradeFromBody({ ...body, beforeChartUrl, afterChartUrl });
    await addTradeForUser(session.userId, trade);
    const trades = await getTradesForUser(session.userId);
    const updatedMeta = await journalMeta(session.userId);
    return NextResponse.json({ trades, ...updatedMeta });
  } catch (err) {
    console.error("[trades POST]", err);
    return NextResponse.json({ error: "Failed to save trade." }, { status: 500 });
  }
}
