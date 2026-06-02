"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/journal-entry", label: "Journal Entry" },
  { href: "/calendar", label: "Calendar View" },
  { href: "/gallery", label: "Gallery View" },
  { href: "/pricing", label: "Pricing" },
];

function navClass(active: boolean) {
  return active
    ? "rounded-2xl bg-sky-100 px-4 py-3 text-sky-700 shadow-sm transition"
    : "rounded-2xl px-4 py-3 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700";
}

export function XauJournalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-800 md:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[270px_1fr]">
        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Premium Journal</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">XAUJournal</h1>
            <p className="mt-2 text-sm text-slate-500">Discipline-first trading journal for Gold traders.</p>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={navClass(pathname === item.href)}>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">{children}</main>
      </div>
    </div>
  );
}
