import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { calculateDisciplineScore } from "@/lib/data";
import { addTradeForUser, getTradesForUser } from "@/lib/trades-store";
import { JournalTrade } from "@/lib/types";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trades = await getTradesForUser(session.user.id);
  return NextResponse.json({ trades });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const disciplineChecklist = body.disciplineChecklist;
    const disciplineScore = calculateDisciplineScore(disciplineChecklist);

    const trade: JournalTrade = {
      id: `t-${Date.now()}`,
      asset: "XAUUSD (Gold)",
      date: body.date,
      type: body.type,
      netProfitLoss: Number(body.netProfitLoss),
      rMultiple: body.rMultiple,
      entryPrice: Number(body.entryPrice),
      exitPrice: Number(body.exitPrice),
      session: body.session,
      setupTags: body.setupTags,
      emotion: body.emotion,
      beforeChartUrl: body.beforeChartUrl,
      afterChartUrl: body.afterChartUrl,
      disciplineChecklist,
      disciplineScore,
    };

    await addTradeForUser(session.user.id, trade);
    const trades = await getTradesForUser(session.user.id);
    return NextResponse.json({ trade, trades });
  } catch {
    return NextResponse.json({ error: "Failed to save trade." }, { status: 500 });
  }
}
