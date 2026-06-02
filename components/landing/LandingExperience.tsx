"use client";

import Link from "next/link";
import { DeviceFrame } from "@/components/landing/DeviceFrame";
import { LandingFaq } from "@/components/landing/LandingFaq";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { MockCalendar } from "@/components/landing/screens/MockCalendar";
import { MockDashboard } from "@/components/landing/screens/MockDashboard";
import { MockGallery } from "@/components/landing/screens/MockGallery";
import { MockJournal } from "@/components/landing/screens/MockJournal";

const chapters = [
  {
    step: "01",
    title: "The problem",
    hook: "You're trading without a mirror.",
    body: "Every impulsive entry and broken rule costs tuition — unless you log it with intention.",
  },
  {
    step: "02",
    title: "The pattern",
    hook: "Your edge is already in your history.",
    body: "Winning sessions, best setups, and calm emotions are buried in past trades. You need structure to see them.",
  },
  {
    step: "03",
    title: "The insight",
    hook: "Discipline data beats gut feel.",
    body: "Equity curves, session heatmaps, and checklist scores turn feelings into patterns you can act on.",
  },
  {
    step: "04",
    title: "The solution",
    hook: "Meet XAUJournal.",
    body: "A manual, discipline-first journal built only for XAUUSD — clarity without broker noise.",
  },
];

const features = [
  {
    title: "Discipline checklist",
    body: "Score every trade against your plan before you save — no autopilot logging.",
  },
  {
    title: "Deep analytics",
    body: "Equity curve, setup win rate, session P&L, and day×hour heatmaps in one calm dashboard.",
  },
  {
    title: "Trade calendar",
    body: "Pastel daily blocks show consistency at a glance — mint, rose, and gold for each day.",
  },
  {
    title: "Chart gallery",
    body: "Before and after screenshots side by side — study what your memory forgets.",
  },
  {
    title: "Private by design",
    body: "Your journal is yours. Manual entry means you control every field that enters the record.",
  },
  {
    title: "Session intelligence",
    body: "London, New York, and Asian session tags reveal where your edge actually lives.",
  },
];

const productSections = [
  {
    id: "dashboard",
    eyebrow: "Dashboard",
    hook: "See your edge in one calm glance.",
    body: "Win rate, discipline score, net P&L, equity curve, and recent trades — how serious gold traders review their week.",
    shot: <MockDashboard />,
    reverse: false,
  },
  {
    id: "journal",
    eyebrow: "Journal entry",
    hook: "Log with intention, not impulse.",
    body: "A discipline gate before every save. Setup tags, emotion, and chart uploads keep each trade accountable.",
    shot: <MockJournal />,
    reverse: true,
  },
  {
    id: "calendar",
    eyebrow: "Calendar",
    hook: "Your consistency, color-coded.",
    body: "Daily P&L blocks turn routine into visual truth — soft pastels, no harsh red/green neon.",
    shot: <MockCalendar />,
    reverse: false,
  },
  {
    id: "gallery",
    eyebrow: "Gallery",
    hook: "Study charts like a pro portfolio.",
    body: "Scroll your before/after history and spot the patterns that repeat.",
    shot: <MockGallery />,
    reverse: true,
  },
];

export function LandingExperience() {
  return (
    <div className="landing-root bg-xau-app text-xau-ink">
      <header className="landing-nav fixed inset-x-0 top-0 z-50 border-b border-xau-border/60 bg-xau-app/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-xau-gold to-xau-gold-accent text-xs font-bold text-xau-ink">
              Au
            </span>
            <span className="text-lg font-semibold tracking-tight">XAUJournal</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-xau-muted md:flex">
            <a href="#story" className="hover:text-xau-ink">
              Story
            </a>
            <a href="#features" className="hover:text-xau-ink">
              Features
            </a>
            <a href="#product" className="hover:text-xau-ink">
              Product
            </a>
            <a href="#faq" className="hover:text-xau-ink">
              FAQ
            </a>
          </nav>
          <div className="flex gap-2">
            <Link href="/login" className="hidden rounded-full px-4 py-2 text-sm text-xau-muted sm:inline-block hover:bg-xau-card">
              Sign in
            </Link>
            <Link href="/register" className="xau-btn-gold rounded-full px-4 py-2">
              Start free
            </Link>
          </div>
        </div>
      </header>

      <main className="landing-scroll pt-14">
        <section className="landing-section flex min-h-[85vh] items-center py-12 md:py-16">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 lg:grid-cols-2 lg:items-center">
            <ScrollReveal>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-xau-muted">Exclusively for gold traders</p>
              <h1 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
                Every trade tells a story.
                <span className="mt-2 block bg-gradient-to-r from-xau-gold-accent to-amber-700 bg-clip-text text-transparent">
                  Write yours with discipline.
                </span>
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-xau-muted md:text-lg">
                XAUJournal is a manual, reflection-first workspace for XAUUSD — checklist scoring, pastel analytics, and
                chart study without broker clutter.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/register" className="xau-btn-gold rounded-full px-7 py-3.5 shadow-card">
                  Start your journal
                </Link>
                <Link href="/login" className="xau-btn-ghost rounded-full px-7 py-3.5">
                  Sign in
                </Link>
              </div>
              <p className="mt-3 text-xs text-xau-muted">Free tier · 10 trades · No card required</p>
            </ScrollReveal>
            <ScrollReveal delayMs={80}>
              <DeviceFrame label="xaujournal — Dashboard">
                <MockDashboard />
              </DeviceFrame>
            </ScrollReveal>
          </div>
        </section>

        <section id="story" className="border-y border-xau-border bg-xau-card py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <ScrollReveal>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-xau-gold-accent">Your trading story</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">From noise to clarity.</h2>
            </ScrollReveal>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {chapters.map((ch, i) => (
                <ScrollReveal key={ch.step} delayMs={i * 60} className="rounded-2xl border border-xau-border bg-xau-app p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-xau-muted">Chapter {ch.step}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-xau-gold-accent">{ch.title}</p>
                  <h3 className="mt-3 text-xl font-semibold text-xau-ink">{ch.hook}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-xau-muted">{ch.body}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <ScrollReveal className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-xau-muted">The platform</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Every tool you need. Nothing you don&apos;t.</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-xau-muted">
                Built for traders who want calm, scannable insight — not another bloated terminal.
              </p>
            </ScrollReveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <ScrollReveal
                  key={f.title}
                  delayMs={i * 40}
                  className="rounded-2xl border border-xau-border bg-xau-card p-5 transition hover:shadow-card"
                >
                  <h3 className="text-base font-semibold text-xau-ink">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-xau-muted">{f.body}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section id="product" className="border-t border-xau-border py-4">
          {productSections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="landing-section scroll-mt-20 border-b border-xau-border py-12 md:py-16"
            >
              <div
                className={`mx-auto grid w-full max-w-6xl gap-8 px-6 lg:grid-cols-2 lg:items-center ${
                  section.reverse ? "lg:[direction:rtl]" : ""
                }`}
              >
                <ScrollReveal className={`space-y-3 ${section.reverse ? "lg:[direction:ltr]" : ""}`}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-xau-muted">{section.eyebrow}</p>
                  <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">{section.hook}</h2>
                  <p className="max-w-md text-base leading-relaxed text-xau-muted">{section.body}</p>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-xau-ink transition hover:text-xau-gold-accent"
                  >
                    Try it free <span aria-hidden>→</span>
                  </Link>
                </ScrollReveal>
                <ScrollReveal delayMs={80} className={section.reverse ? "lg:[direction:ltr]" : ""}>
                  <DeviceFrame>{section.shot}</DeviceFrame>
                </ScrollReveal>
              </div>
            </div>
          ))}
        </section>

        <section id="faq" className="py-14 md:py-20">
          <div className="mx-auto max-w-3xl px-6">
            <ScrollReveal className="mb-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-xau-muted">FAQ</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">Gold journal questions</h2>
            </ScrollReveal>
            <ScrollReveal delayMs={60}>
              <LandingFaq />
            </ScrollReveal>
          </div>
        </section>

        <section className="landing-section bg-xau-ink py-16 text-xau-card md:py-20">
          <ScrollReveal className="mx-auto max-w-3xl px-6 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-xau-gold">Built for XAUUSD traders</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Stop guessing. Start knowing.</h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-white/70">
              Manual reflection that compounds — discipline first, analytics second.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/register" className="xau-btn-gold rounded-full px-8 py-3.5">
                Create free account
              </Link>
              <Link
                href="/pricing"
                className="rounded-full border border-xau-gold/40 px-8 py-3.5 text-sm font-medium transition hover:border-xau-gold"
              >
                View pricing
              </Link>
            </div>
          </ScrollReveal>
        </section>
      </main>

      <footer className="border-t border-xau-border py-6 text-center text-xs text-xau-muted">
        © {new Date().getFullYear()} XAUJournal · Manual reflection for high-discipline gold trading
      </footer>
    </div>
  );
}
