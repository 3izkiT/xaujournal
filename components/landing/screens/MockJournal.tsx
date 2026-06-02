export function MockJournal() {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-emerald-500">Pre-trade checklist</p>
        <h3 className="text-base font-semibold text-slate-900">Journal Entry</h3>
      </div>
      <div className="space-y-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
        <label className="flex items-center gap-2 text-[10px] text-slate-700">
          <span className="h-3 w-3 rounded bg-emerald-400" /> Followed trading plan
        </label>
        <label className="flex items-center gap-2 text-[10px] text-slate-700">
          <span className="h-3 w-3 rounded bg-emerald-400" /> R:R at least 1:2
        </label>
        <label className="flex items-center gap-2 text-[10px] text-slate-700">
          <span className="h-3 w-3 rounded border border-slate-300 bg-white" /> Calm, no FOMO
        </label>
        <p className="text-[10px] font-medium text-sky-700">Discipline Score: 66%</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="h-8 rounded-lg bg-white ring-1 ring-slate-200" />
        <div className="h-8 rounded-lg bg-white ring-1 ring-slate-200" />
        <div className="h-8 rounded-lg bg-white ring-1 ring-slate-200" />
        <div className="h-8 rounded-lg bg-white ring-1 ring-slate-200" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex h-24 flex-col items-center justify-center rounded-xl border border-dashed border-sky-200 bg-sky-50 text-[9px] text-sky-600">
          Before chart
        </div>
        <div className="flex h-24 flex-col items-center justify-center rounded-xl border border-dashed border-emerald-200 bg-emerald-50 text-[9px] text-emerald-600">
          After chart
        </div>
      </div>
    </div>
  );
}
