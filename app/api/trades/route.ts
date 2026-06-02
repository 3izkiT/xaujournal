import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/app-session";
import { calculateDisciplineScore } from "@/lib/data";
import { isDatabaseConfigured } from "@/lib/db";
import { getTradeLimit, FREE_TRADE_LIMIT } from "@/lib/plans";
import { addTradeForUser, countTradesForUser, getTradesForUser, getUserPlan } from "@/lib/trades-store";
import { JournalTrade } from "@/lib/types";
import { validateTradeNotes } from "@/lib/validate-trade";
import { Plan } from "@prisma/client";

async function journalMeta(userId: string) {
  const [plan, tradeCount] = await Promise.all([getUserPlan(userId), countTradesForUser(userId)]);
  const tradeLimit = getTradeLimit(plan);
  return {
    plan: plan as Plan,
    tradeCount,
    tradeLimit,
    canAddMore: tradeLimit == null || tradeCount < tradeLimit,
  };
}

export async function GET() {
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

  const [trades, meta] = await Promise.all([
    getTradesForUser(session.userId),
    journalMeta(session.userId),
  ]);

  return NextResponse.json({ trades, ...meta });
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
          error: `Free tier limit reached (${FREE_TRADE_LIMIT} logs). Upgrade to Premium for unlimited logs.`,
          code: "TRADE_LIMIT_REACHED",
          ...meta,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const noteError = validateTradeNotes(body);
    if (noteError) {
      return NextResponse.json({ error: noteError }, { status: 400 });
    }

    const disciplineChecklist = body.disciplineChecklist;
    const disciplineScore = calculateDisciplineScore(disciplineChecklist);
    const entryAt = body.entryAt ? new Date(body.entryAt).toISOString() : new Date(`${body.date}T12:00:00`).toISOString();
    const exitAt = body.exitAt ? new Date(body.exitAt).toISOString() : null;

    const trade: JournalTrade = {
      id: `t-${Date.now()}`,
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
      beforeChartUrl: body.beforeChartUrl,
      afterChartUrl: body.afterChartUrl,
      disciplineChecklist,
      disciplineScore,
      noteContext: body.noteContext,
      noteMistake: body.noteMistake,
      noteNextAction: body.noteNextAction,
    };

    await addTradeForUser(session.userId, trade);
    const trades = await getTradesForUser(session.userId);
    const updatedMeta = await journalMeta(session.userId);
    return NextResponse.json({ trade, trades, ...updatedMeta });
  } catch {
    return NextResponse.json({ error: "Failed to save trade." }, { status: 500 });
  }
}
