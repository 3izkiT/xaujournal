import { ReactNode } from "react";

export function DeviceFrame({ children, label = "XAUJournal" }: { children: ReactNode; label?: string }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_24px_80px_-20px_rgba(15,23,42,0.35)]">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/90 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        <span className="ml-2 text-xs font-medium text-slate-500">{label}</span>
      </div>
      <div className="bg-slate-50 p-3 sm:p-4">{children}</div>
    </div>
  );
}
