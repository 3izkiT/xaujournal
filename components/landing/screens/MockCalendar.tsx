export function MockCalendar() {
  const cells = Array.from({ length: 28 }, (_, i) => {
    if (i % 9 === 0) return "bg-xau-profit-bg";
    if (i % 7 === 0) return "bg-xau-loss-bg";
    if (i % 5 === 0) return "bg-xau-gold-soft";
    return "bg-xau-app";
  });

  return (
    <div className="space-y-3">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-xau-gold-accent">Consistency view</p>
        <h3 className="text-base font-semibold text-xau-ink">Calendar View</h3>
        <p className="text-xs text-xau-muted">
          <span className="text-tv-profit">Profit days</span> · <span className="text-tv-loss">Loss days</span>
        </p>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((tone, i) => (
          <div key={i} className={`aspect-square rounded-lg border border-xau-border/50 ${tone}`} />
        ))}
      </div>
    </div>
  );
}
