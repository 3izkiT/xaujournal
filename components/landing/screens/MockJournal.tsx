export function MockJournal() {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-xau-profit">Pre-trade checklist</p>
        <h3 className="text-base font-semibold text-xau-ink">Journal Entry</h3>
      </div>
      <div className="space-y-2 rounded-2xl border border-xau-border bg-xau-mint p-3">
        <label className="flex items-center gap-2 text-[10px] text-xau-ink">
          <span className="h-3 w-3 rounded bg-xau-profit" /> Followed trading plan
        </label>
        <label className="flex items-center gap-2 text-[10px] text-xau-ink">
          <span className="h-3 w-3 rounded bg-xau-profit" /> R:R at least 1:2
        </label>
        <label className="flex items-center gap-2 text-[10px] text-xau-ink">
          <span className="h-3 w-3 rounded border border-xau-border bg-xau-card" /> Calm, no FOMO
        </label>
        <p className="text-[10px] font-semibold text-xau-ink">Discipline Score: 66%</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="h-8 rounded-lg bg-xau-card ring-1 ring-xau-border" />
        <div className="h-8 rounded-lg bg-xau-card ring-1 ring-xau-border" />
        <div className="h-8 rounded-lg bg-xau-card ring-1 ring-xau-border" />
        <div className="h-8 rounded-lg bg-xau-card ring-1 ring-xau-border" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex h-24 flex-col items-center justify-center rounded-xl border border-dashed border-xau-border bg-xau-calm text-[9px] text-xau-muted">
          Before chart
        </div>
        <div className="flex h-24 flex-col items-center justify-center rounded-xl border border-dashed border-xau-border bg-xau-mint text-[9px] text-xau-muted">
          After chart
        </div>
      </div>
    </div>
  );
}
