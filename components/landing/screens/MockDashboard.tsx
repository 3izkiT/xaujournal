export function MockDashboard() {
  const rows = [
    { date: "2026-05-24", type: "Buy", session: "London", r: "+2.8R", net: "+$420", disc: "100%", emotion: "Calm" },
    { date: "2026-05-25", type: "Sell", session: "New York", r: "-1.0R", net: "-$180", disc: "0%", emotion: "FOMO" },
    { date: "2026-05-27", type: "Buy", session: "Asian", r: "+1.9R", net: "+$260", disc: "66%", emotion: "Calm" },
  ];

  return (
    <div className="grid gap-3 lg:grid-cols-[140px_1fr]">
      <aside className="hidden space-y-1.5 rounded-2xl border border-slate-200 bg-white p-2 lg:block">
        <div className="rounded-xl bg-sky-100 px-2 py-2 text-[10px] font-medium text-sky-800">Dashboard</div>
        <div className="rounded-xl px-2 py-2 text-[10px] text-slate-500">Journal Entry</div>
        <div className="rounded-xl px-2 py-2 text-[10px] text-slate-500">Calendar</div>
        <div className="rounded-xl px-2 py-2 text-[10px] text-slate-500">Gallery</div>
      </aside>
      <div className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">XAUUSD · Discipline first</p>
            <h3 className="text-lg font-semibold text-slate-900">Good trading.</h3>
            <p className="text-xs text-slate-500">Discipline averages 67%.</p>
          </div>
          <span className="rounded-xl bg-sky-100 px-3 py-1.5 text-[10px] font-medium text-sky-800">Log new trade</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-2">
            <p className="text-[9px] text-slate-500">Win Rate</p>
            <p className="text-sm font-semibold text-slate-800">50%</p>
          </div>
          <div className="rounded-xl border border-sky-100 bg-sky-50 p-2">
            <p className="text-[9px] text-slate-500">Discipline</p>
            <p className="text-sm font-semibold text-slate-800">67%</p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-2">
            <p className="text-[9px] text-slate-500">Net P&L</p>
            <p className="text-sm font-semibold text-emerald-700">+$845</p>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="h-20 rounded-xl bg-gradient-to-t from-sky-100 to-slate-100" />
          <div className="h-20 rounded-xl bg-gradient-to-t from-emerald-100 to-slate-100" />
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <p className="border-b border-slate-100 px-2 py-1.5 text-[10px] font-medium text-slate-700">Recent trades</p>
          <table className="w-full text-[9px]">
            <thead className="text-slate-400">
              <tr>
                <th className="px-1 py-1 text-left">Date</th>
                <th className="px-1 py-1">Type</th>
                <th className="px-1 py-1">R</th>
                <th className="px-1 py-1">Net</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.date} className="border-t border-slate-50 text-slate-600">
                  <td className="px-1 py-1">{row.date.slice(5)}</td>
                  <td className="px-1 py-1 text-center">{row.type}</td>
                  <td className="px-1 py-1 text-center">{row.r}</td>
                  <td className={`px-1 py-1 text-center ${row.net.startsWith("+") ? "text-emerald-600" : "text-rose-600"}`}>
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
