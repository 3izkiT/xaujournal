"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ReactNode, useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", desc: "KPI + insights" },
  { href: "/journal-entry", label: "Journal Entry", desc: "Add new trade" },
  { href: "/calendar", label: "Calendar View", desc: "Monthly consistency" },
  { href: "/gallery", label: "Gallery View", desc: "Before / after study" },
  { href: "/pricing", label: "Pricing", desc: "Plans and upgrade" },
];

function navClass(active: boolean) {
  return active
    ? "block w-full rounded-2xl border border-sky-200 bg-sky-100 px-4 py-3 text-sky-800 shadow-sm transition"
    : "block w-full rounded-2xl border border-transparent px-4 py-3 text-slate-600 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-800";
}

function SidebarNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-2.5">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={navClass(pathname === item.href)}
          onClick={onNavigate}
        >
          <span className="block text-sm font-medium leading-tight">{item.label}</span>
          <span className="mt-1 block text-xs text-slate-500">{item.desc}</span>
        </Link>
      ))}
    </nav>
  );
}

export function XauJournalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm lg:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">XAUJournal</p>
          <p className="text-sm font-medium text-slate-800">{session?.user?.name ?? "Member"}</p>
        </div>
        <button
          type="button"
          aria-label="Open menu"
          className="rounded-2xl bg-sky-100 px-4 py-2 text-sm font-medium text-sky-700"
          onClick={() => setMobileOpen(true)}
        >
          Menu
        </button>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu overlay"
            className="absolute inset-0 bg-slate-900/30"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-[min(100%,320px)] flex-col bg-white p-5 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-xl font-semibold text-slate-900">XAUJournal</h1>
              <button
                type="button"
                className="rounded-xl bg-slate-100 px-3 py-1 text-sm text-slate-600"
                onClick={() => setMobileOpen(false)}
              >
                Close
              </button>
            </div>
            <SidebarNav pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            <div className="mt-auto space-y-2 border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-500">{session?.user?.email}</p>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full rounded-2xl bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
              >
                Sign out
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 md:px-8 lg:grid-cols-[310px_1fr] lg:py-8">
        <aside className="hidden h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:block">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Premium Journal</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">XAUJournal</h1>
            <p className="mt-2 text-sm text-slate-500">Discipline-first trading journal for Gold traders.</p>
          </div>
          <SidebarNav pathname={pathname} />
          <div className="mt-8 space-y-2 border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-500">{session?.user?.email}</p>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full rounded-2xl bg-rose-50 px-4 py-2 text-sm text-rose-700 transition hover:bg-rose-100"
            >
              Sign out
            </button>
          </div>
        </aside>

        <main className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">{children}</main>
      </div>
    </div>
  );
}
