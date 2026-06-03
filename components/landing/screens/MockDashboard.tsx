export function MockDashboard() {
  const rows = [
    { date: "2026-05-24", type: "Buy", session: "London", r: "+2.8R", net: "+$420", disc: "100%", emotion: "Calm" },
    { date: "2026-05-25", type: "Sell", session: "New York", r: "-1.0R", net: "-$180", disc: "0%", emotion: "FOMO" },
    { date: "2026-05-27", type: "Buy", session: "Asian", r: "+1.9R", net: "+$260", disc: "66%", emotion: "Calm" },
  ];

  return (
    <div className="grid gap-3 lg:grid-cols-[140px_1fr]">
      <aside className="hidden space-y-1.5 rounded-2xl border border-xau-border bg-xau-card p-2 lg:block">
        <div className="rounded-xl bg-xau-gold-soft px-2 py-2 text-[10px] font-medium text-xau-ink">Dashboard</div>
        <div className="rounded-xl px-2 py-2 text-[10px] text-xau-muted">Journal Entry</div>
        <div className="rounded-xl px-2 py-2 text-[10px] text-xau-muted">Calendar</div>
        <div className="rounded-xl px-2 py-2 text-[10px] text-xau-muted">Gallery</div>
      </aside>
      <div className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-xau-muted">XAUUSD · Discipline first</p>
            <h3 className="text-lg font-semibold text-xau-ink">Good trading.</h3>
            <p className="text-xs text-xau-muted">Discipline averages 67%.</p>
          </div>
          <span className="rounded-xl bg-xau-gold-soft px-3 py-1.5 text-[10px] font-medium text-xau-ink">Log new trade</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-xau-border bg-xau-calm p-2">
            <p className="text-[9px] text-xau-muted">Win Rate</p>
            <p className="text-sm font-semibold text-xau-ink">50%</p>
          </div>
          <div className="rounded-xl border border-xau-border bg-xau-gold-soft p-2">
            <p className="text-[9px] text-xau-muted">Discipline</p>
            <p className="text-sm font-semibold text-xau-ink">67%</p>
          </div>
          <div className="rounded-xl border border-xau-border bg-xau-profit-bg p-2">
            <p className="text-[9px] text-xau-muted">Net P&L</p>
            <p className="text-sm font-semibold text-tv-profit">+$845</p>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="h-20 rounded-xl bg-gradient-to-t from-xau-calm to-xau-app" />
          <div className="h-20 rounded-xl bg-gradient-to-t from-xau-profit-bg to-xau-app" />
        </div>
        <div className="overflow-hidden rounded-xl border border-xau-border bg-xau-card">
          <p className="border-b border-xau-border px-2 py-1.5 text-[10px] font-medium text-xau-ink">Recent trades</p>
          <table className="w-full text-[9px]">
            <thead className="text-xau-muted">
              <tr>
                <th className="px-1 py-1 text-left">Date</th>
                <th className="px-1 py-1">Type</th>
                <th className="px-1 py-1">R</th>
                <th className="px-1 py-1">Net</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.date} className="border-t border-xau-border text-xau-muted">
                  <td className="px-1 py-1">{row.date.slice(5)}</td>
                  <td className="px-1 py-1 text-center">{row.type}</td>
                  <td className="px-1 py-1 text-center">{row.r}</td>
                  <td
                    className={`px-1 py-1 text-center font-medium ${row.net.startsWith("+") ? "text-tv-profit" : "text-tv-loss"}`}
                  >
                    {row.net}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
