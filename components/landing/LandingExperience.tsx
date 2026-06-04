"use client";

import { Suspense } from "react";
import Link from "next/link";
import { HomeAuthQueryModal } from "@/components/auth/HomeAuthQueryModal";
import { DeviceFrame } from "@/components/landing/DeviceFrame";
import { LandingFaq } from "@/components/landing/LandingFaq";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SiteFooter } from "@/components/SiteFooter";
import { LandingAdBottom, LandingAdMid, LandingAdTop } from "@/components/ads/LandingAds";
import { BRAND_NAME, BRAND_SLUG } from "@/lib/brand";
import { HOME_HERO_SEO_LINE } from "@/lib/seo-home";
import { AuthModalTrigger } from "@/components/auth/AuthModalTrigger";
import { isOpenAccessActive, PAYMENTS_ENABLED } from "@/lib/monetization";
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
    hook: `Meet ${BRAND_NAME}.`,
    body: "A manual, discipline-first XAUUSD journal — no MT5 sync, only trades you choose to understand.",
  },
];

const features = [
  {
    title: "Discipline checklist",
    body: "Score every trade against your plan before you save — no autopilot logging.",
  },
  {
    title: "TradingView-style P&L",
    body: "Green #089981 and red #f23645 in light and dark mode — the same language as your charts.",
  },
  {
    title: "Deep analytics",
    body: "Equity curve, setup quality, session P&L, and heatmaps — when you have enough intentional logs.",
  },
  {
    title: "Trade calendar",
    body: "Daily blocks colored by profit or loss — consistency at a glance.",
  },
  {
    title: "Chart gallery",
    body: "Before and after screenshots side by side — study what your memory forgets.",
  },
  {
    title: "No broker sync",
    body: "We will not auto-import trades. You log on purpose — that is how discipline compounds.",
  },
  {
    title: "Session intelligence",
    body: "Sydney, Tokyo, London, and New York session tags reveal where your edge actually lives.",
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
    body: "Daily P&L blocks use TradingView green and red — the same profit/loss language as your charts.",
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
      <Suspense fallback={null}>
        <HomeAuthQueryModal />
      </Suspense>
      <header className="landing-nav fixed inset-x-0 top-0 z-50 border-b border-xau-border/60 bg-xau-app/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-xau-gold to-xau-gold-accent text-xs font-bold text-xau-ink">
              Au
            </span>
            <span className="text-lg font-semibold tracking-tight">{BRAND_NAME}</span>
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
          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:flex" />
            <AuthModalTrigger
              mode="login"
              className="hidden rounded-full px-4 py-2 text-sm text-xau-muted md:inline-block hover:bg-xau-card"
            >
              Sign in
            </AuthModalTrigger>
            <AuthModalTrigger mode="register" className="xau-btn-gold rounded-full px-4 py-2">
              Start free
            </AuthModalTrigger>
          </div>
        </div>
      </header>

      <main className="landing-scroll pt-14">
        <LandingAdTop />
        <section className="landing-section flex min-h-[85vh] items-center py-12 md:py-16">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 lg:grid-cols-2 lg:items-center">
            <ScrollReveal>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-xau-muted">
                {BRAND_NAME} · Exclusively for gold traders
              </p>
              <h1 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
                XAUUSD gold trading journal — every trade tells a story.
                <span className="mt-2 block bg-gradient-to-r from-xau-gold-accent to-amber-700 bg-clip-text text-transparent">
                  Write yours with discipline.
                </span>
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-xau-muted md:text-lg">{HOME_HERO_SEO_LINE}</p>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-xau-muted">
                Discipline checklist, emotion, chart study, and analytics — no MT5 sync. Self-improvement starts when you
                log on purpose.
              </p>
              <p className="mt-2 flex flex-wrap items-center gap-3 text-xs text-xau-muted">
                <span className="text-tv-profit font-medium">● Profit</span>
                <span className="text-tv-loss font-medium">● Loss</span>
                <span>TradingView colors · Light &amp; dark</span>
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <AuthModalTrigger mode="register" className="xau-btn-gold rounded-full px-7 py-3.5 shadow-card">
                  Start with Google
                </AuthModalTrigger>
                <AuthModalTrigger mode="login" className="xau-btn-ghost rounded-full px-7 py-3.5">
                  Sign in
                </AuthModalTrigger>
              </div>
              <p className="mt-3 text-xs text-xau-muted">
                {isOpenAccessActive()
                  ? "Early access · Sign in with Google · Full features free"
                  : "Free tier · Sign in with Google"}
              </p>
            </ScrollReveal>
            <ScrollReveal delayMs={80}>
              <DeviceFrame label={`${BRAND_SLUG} — Dashboard`}>
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

        <LandingAdMid />

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
                  <AuthModalTrigger
                    mode="register"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-xau-ink transition hover:text-xau-gold-accent"
                  >
                    Try it free <span aria-hidden>→</span>
                  </AuthModalTrigger>
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

        <section className="landing-section bg-[#131722] py-16 text-[#d1d4dc] md:py-20">
          <ScrollReveal className="mx-auto max-w-3xl px-6 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-xau-gold">Built for XAUUSD traders</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Stop guessing. Start knowing.</h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-white/70">
              Manual reflection that compounds — discipline first, analytics second.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <AuthModalTrigger mode="register" className="xau-btn-gold rounded-full px-8 py-3.5">
                Get started with Google
              </AuthModalTrigger>
              {PAYMENTS_ENABLED && (
                <Link
                  href="/pricing"
                  className="rounded-full border border-xau-gold/40 px-8 py-3.5 text-sm font-medium transition hover:border-xau-gold"
                >
                  View pricing
                </Link>
              )}
            </div>
          </ScrollReveal>
        </section>
      </main>

      <LandingAdBottom />
      <SiteFooter />
    </div>
  );
}
