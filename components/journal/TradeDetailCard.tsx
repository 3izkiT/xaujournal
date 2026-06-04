import { ExpandableChartImage, type ChartSlide } from "@/components/journal/ChartImageLightbox";
import type { JournalTrade } from "@/lib/types";

function formatTime(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "—";
  }
}

function NoteBlock({ label, text }: { label: string; text: string }) {
  const trimmed = text.trim();
  return (
    <div className="rounded-xl border border-xau-border bg-xau-app p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-xau-muted">{label}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-xau-ink">
        {trimmed || <span className="text-xau-muted">—</span>}
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-xau-border bg-xau-card px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-xau-muted">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-xau-ink">{value}</p>
    </div>
  );
}

type Props = {
  trade: JournalTrade;
  onClose?: () => void;
};


function ChartSection({ trade }: { trade: JournalTrade }) {
  const slides: ChartSlide[] = [
    { src: trade.beforeChartUrl, alt: "Before trade chart", caption: "Before trade" },
    { src: trade.afterChartUrl, alt: "After trade chart", caption: "After trade" },
  ];

  return (
    <div>
      <h3 className="text-sm font-semibold text-xau-ink">Charts</h3>
      <p className="mt-1 text-xs text-xau-muted">Tap a screenshot to expand. Arrow keys switch before / after.</p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs text-xau-muted">Before</p>
          <ExpandableChartImage
            src={trade.beforeChartUrl}
            alt="Before trade chart"
            fit="contain"
            slides={slides}
            slideIndex={0}
          />
        </div>
        <div>
          <p className="mb-2 text-xs text-xau-muted">After</p>
          <ExpandableChartImage
            src={trade.afterChartUrl}
            alt="After trade chart"
            fit="contain"
            slides={slides}
            slideIndex={1}
          />
        </div>
      </div>
    </div>
  );
}

export function TradeDetailCard({ trade, onClose }: Props) {
  const checklist = trade.disciplineChecklist;
  const pnlClass = trade.netProfitLoss >= 0 ? "text-tv-profit" : "text-tv-loss";

  return (
    <article className="xau-card-bordered space-y-6 p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-xau-gold-accent">Trade log detail</p>
          <h2 className="mt-1 text-xl font-semibold text-xau-ink">
            {trade.date} · {trade.type} · {trade.session}
          </h2>
          <p className="mt-1 text-sm text-xau-muted">
            Entry {formatTime(trade.entryAt)}
            {trade.exitAt ? ` → Exit ${formatTime(trade.exitAt)}` : ""}
            {trade.holdTimeMinutes != null ? ` · Hold ${trade.holdTimeMinutes}m` : ""}
          </p>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="xau-btn-ghost text-xs">
            Close
          </button>
        )}
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Net P&L" value={`${trade.netProfitLoss >= 0 ? "+" : "-"}$${Math.abs(trade.netProfitLoss).toFixed(2)}`} />
        <Stat label="R-multiple" value={trade.rMultiple} />
        <Stat label="Entry → Exit" value={`${trade.entryPrice} → ${trade.exitPrice}`} />
        <Stat label="Discipline" value={`${trade.disciplineScore}%`} />
        <Stat label="MAE" value={trade.mae != null ? `$${trade.mae}` : "—"} />
        <Stat label="MFE" value={trade.mfe != null ? `$${trade.mfe}` : "—"} />
        <Stat label="Emotion" value={trade.emotion} />
        <Stat
          label="Setup tags"
          value={trade.setupTags.length > 0 ? trade.setupTags.join(", ") : "—"}
        />
      </div>

      <div className="rounded-xl border border-xau-border bg-xau-calm p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-xau-muted">Pre-trade checklist</p>
        <ul className="mt-3 space-y-2 text-sm text-xau-ink">
          <li>{checklist.followedPlan ? "✓" : "✗"} Followed trading plan</li>
          <li>{checklist.rrAtLeastOneToTwo ? "✓" : "✗"} Risk:reward at least 1:2</li>
          <li>{checklist.calmMindset ? "✓" : "✗"} Calm mindset (no FOMO)</li>
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-xau-ink">Reflection notes</h3>
        <p className="mt-1 text-xs text-xau-muted">Context, mistake, and next action you wrote when logging.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-1">
          <NoteBlock label="Context" text={trade.noteContext} />
          <NoteBlock label="Mistake" text={trade.noteMistake} />
          <NoteBlock label="Next action" text={trade.noteNextAction} />
        </div>
      </div>

      <ChartSection trade={trade} />

      <p className={`text-lg font-semibold ${pnlClass}`}>
        {trade.netProfitLoss >= 0 ? "+" : "-"}${Math.abs(trade.netProfitLoss).toFixed(2)} net
      </p>
    </article>
  );
}
