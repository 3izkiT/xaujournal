export function MockGallery() {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-xau-gold-accent">Chart study</p>
        <h3 className="text-base font-semibold text-xau-ink">Gallery View</h3>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {[1, 2].map((card) => (
          <article key={card} className="rounded-xl border border-xau-border bg-xau-card p-2">
            <p className="mb-2 text-[9px] text-xau-muted">2026-05-2{card} · Buy</p>
            <div className="grid grid-cols-2 gap-1">
              <div className="h-16 rounded-lg bg-gradient-to-br from-xau-border to-xau-muted/30" />
              <div className="h-16 rounded-lg bg-gradient-to-br from-xau-mint to-xau-calm" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
