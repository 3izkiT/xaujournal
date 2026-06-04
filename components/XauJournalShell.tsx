"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BRAND_NAME, BRAND_SHORT } from "@/lib/brand";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

const mainNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: <IconGrid /> },
  { href: "/analytics", label: "Analytics", icon: <IconChart /> },
  { href: "/calendar", label: "Calendar", icon: <IconCalendar /> },
  { href: "/journal-entry", label: "Journal", icon: <IconPen /> },
  { href: "/history", label: "History", icon: <IconList /> },
  { href: "/gallery", label: "Gallery", icon: <IconImage /> },
];

const secondaryNav: NavItem[] = [{ href: "/settings", label: "Settings", icon: <IconGear /> }];

function IconGrid() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconPen() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 20h9M4 20h2l9.5-9.5a2 2 0 0 0 0-2.8l-.7-.7a2 2 0 0 0-2.8 0L4 16.2V20z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconList() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconImage() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M21 16l-5-5-4 4-2-2-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconGear() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
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

function NavLink({ item, active, onNavigate }: { item: NavItem; active: boolean; onNavigate?: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-xau-gold-soft text-xau-ink shadow-sm"
          : "text-xau-muted hover:bg-xau-app hover:text-xau-ink"
      }`}
    >
      <span className={active ? "text-xau-gold-accent" : "text-xau-muted"}>{item.icon}</span>
      {item.label}
    </Link>
  );
}

function SidebarContent({
  pathname,
  userEmail,
  onNavigate,
  onSignOut,
}: {
  pathname: string;
  userEmail: string | null;
  onNavigate?: () => void;
  onSignOut: () => void;
}) {
  return (
    <>
      <div className="flex items-center gap-2.5 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-xau-gold to-xau-gold-accent text-xs font-bold text-xau-ink">
          Au
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-xau-ink">{BRAND_NAME}</p>
          <p className="text-[10px] uppercase tracking-wider text-xau-muted">{BRAND_SHORT}</p>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1" aria-label="Main navigation">
        {mainNav.map((item) => (
          <NavLink key={item.href} item={item} active={pathname === item.href} onNavigate={onNavigate} />
        ))}
        <div className="my-3 border-t border-xau-border" />
        {secondaryNav.map((item) => (
          <NavLink key={item.href} item={item} active={pathname === item.href} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="mt-auto space-y-2 border-t border-xau-border pt-4">
        <ThemeToggle className="w-full justify-center" />
        <Link
          href="/pricing"
          className="block rounded-xl px-3 py-2 text-xs font-medium text-xau-muted hover:bg-xau-app hover:text-xau-ink"
          onClick={onNavigate}
        >
          Upgrade plan
        </Link>
        <p className="truncate px-3 text-[11px] text-xau-muted">{userEmail}</p>
        <button
          type="button"
          onClick={onSignOut}
          className="w-full rounded-xl px-3 py-2 text-left text-sm text-xau-loss hover:bg-xau-rose"
        >
          Sign out
        </button>
      </div>
    </>
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
    <div className="min-h-screen bg-xau-app text-xau-ink lg:flex">
      {/* Mobile header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-xau-border bg-xau-card px-4 py-3 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-xau-gold to-xau-gold-accent text-[10px] font-bold">
            Au
          </span>
          <span className="text-sm font-semibold">{BRAND_NAME}</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-xau-border"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 lg:hidden ${mobileOpen ? "" : "pointer-events-none"}`}>
        <button
          type="button"
          aria-label="Close"
          className={`absolute inset-0 bg-xau-ink/25 transition ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={closeMobile}
        />
        <aside
          className={`absolute left-0 top-0 flex h-full w-[280px] flex-col bg-xau-card p-5 shadow-xl transition ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent pathname={pathname} userEmail={userEmail} onNavigate={closeMobile} onSignOut={() => void handleSignOut()} />
        </aside>
      </div>

      {/* Desktop sidebar — full height, no floating card */}
      <aside className="hidden w-[248px] shrink-0 flex-col border-r border-xau-border bg-xau-card px-4 py-6 lg:flex lg:min-h-screen lg:sticky lg:top-0 lg:h-screen">
        <SidebarContent pathname={pathname} userEmail={userEmail} onSignOut={() => void handleSignOut()} />
      </aside>

      {/* Main canvas — open background, no extra card wrapper */}
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="w-full flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
