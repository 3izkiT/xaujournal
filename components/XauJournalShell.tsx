"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", desc: "KPI + insights" },
  { href: "/journal-entry", label: "Journal Entry", desc: "Add new trade" },
  { href: "/calendar", label: "Calendar View", desc: "Monthly consistency" },
  { href: "/gallery", label: "Gallery View", desc: "Before / after study" },
  { href: "/pricing", label: "Pricing", desc: "Plans and upgrade" },
  { href: "/settings", label: "Settings", desc: "Pro prefs + coach link" },
];

function navClass(active: boolean) {
  return active
    ? "block w-full rounded-2xl border border-sky-200 bg-sky-100 px-4 py-3 text-sky-800 shadow-sm transition"
    : "block w-full rounded-2xl border border-transparent px-4 py-3 text-slate-600 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-800";
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SidebarNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-2.5" aria-label="Main navigation">
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
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    void fetch("/api/auth/me", { credentials: "include", cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data: { user?: { email?: string } }) => setUserEmail(data.user?.email ?? null))
      .catch(() => setUserEmail(null));
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/";
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Mobile app bar: brand left, menu control right (standard pattern) */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm lg:hidden">
        <Link href="/dashboard" className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">XAUJournal</p>
          <p className="truncate text-sm font-medium text-slate-800">Trading journal</p>
        </Link>
        <button
          type="button"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-drawer"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </header>

      {/* Left drawer + backdrop (slides from start / left in LTR) */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          tabIndex={mobileOpen ? 0 : -1}
          aria-label="Close menu"
          className={`absolute inset-0 bg-slate-900/40 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMobile}
        />
        <aside
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={`absolute left-0 top-0 flex h-full w-[min(88vw,320px)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Menu</p>
              <h2 className="text-lg font-semibold text-slate-900">XAUJournal</h2>
            </div>
            <button
              type="button"
              aria-label="Close navigation menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
              onClick={closeMobile}
            >
              <CloseIcon />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            <SidebarNav pathname={pathname} onNavigate={closeMobile} />
          </div>

          <div className="space-y-2 border-t border-slate-100 px-5 py-4">
            <p className="truncate text-xs text-slate-500">{userEmail}</p>
            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="w-full rounded-2xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
            >
              Sign out
            </button>
          </div>
        </aside>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 md:px-8 lg:grid-cols-[310px_1fr] lg:py-8">
        <aside className="hidden h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:block">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Premium Journal</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">XAUJournal</h1>
            <p className="mt-2 text-sm text-slate-500">Discipline-first trading journal for Gold traders.</p>
          </div>
          <SidebarNav pathname={pathname} />
          <div className="mt-8 space-y-2 border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-500">{userEmail}</p>
            <button
              type="button"
              onClick={() => void handleSignOut()}
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
