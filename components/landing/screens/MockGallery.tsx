export function MockGallery() {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-rose-500">Chart study</p>
        <h3 className="text-base font-semibold text-slate-900">Gallery View</h3>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {[1, 2].map((card) => (
          <article key={card} className="rounded-xl border border-slate-200 bg-white p-2">
            <p className="mb-2 text-[9px] text-slate-500">2026-05-2{card} · Buy</p>
            <div className="grid grid-cols-2 gap-1">
              <div className="h-16 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300" />
              <div className="h-16 rounded-lg bg-gradient-to-br from-emerald-100 to-sky-100" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
