export function MockCalendar() {
  const cells = Array.from({ length: 28 }, (_, i) => {
    if (i % 9 === 0) return "bg-emerald-200";
    if (i % 7 === 0) return "bg-rose-200";
    if (i % 5 === 0) return "bg-amber-100";
    return "bg-slate-100";
  });

  return (
    <div className="space-y-3">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-amber-500">Consistency view</p>
        <h3 className="text-base font-semibold text-slate-900">Calendar View</h3>
        <p className="text-xs text-slate-500">Green wins · Pink losses · Yellow break-even</p>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((tone, i) => (
          <div key={i} className={`aspect-square rounded-lg ${tone}`} />
        ))}
      </div>
    </div>
  );
}
