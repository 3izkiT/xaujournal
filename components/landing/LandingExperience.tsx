"use client";

import Link from "next/link";
import { DeviceFrame } from "@/components/landing/DeviceFrame";
import { MockCalendar } from "@/components/landing/screens/MockCalendar";
import { MockDashboard } from "@/components/landing/screens/MockDashboard";
import { MockGallery } from "@/components/landing/screens/MockGallery";
import { MockJournal } from "@/components/landing/screens/MockJournal";

const sections = [
  {
    id: "dashboard",
    eyebrow: "01 · Dashboard",
    hook: "See your edge in one calm glance.",
    body: "Win rate, discipline score, net P&L, equity curve, and recent trades — exactly how serious gold traders review their week.",
    shot: <MockDashboard />,
    reverse: false,
  },
  {
    id: "journal",
    eyebrow: "02 · Journal Entry",
    hook: "Log with intention, not impulse.",
    body: "A 3-point discipline gate before every save. Setup tags, emotion, and before/after charts keep each trade accountable.",
    shot: <MockJournal />,
    reverse: true,
  },
  {
    id: "calendar",
    eyebrow: "03 · Calendar",
    hook: "Your consistency, color-coded.",
    body: "Pastel daily blocks turn routine into visual truth — green discipline days, pink emotional mistakes, yellow break-even.",
    shot: <MockCalendar />,
    reverse: false,
  },
  {
    id: "gallery",
    eyebrow: "04 · Gallery",
    hook: "Study charts like a pro portfolio.",
    body: "Before and after screenshots side by side. Scroll your history and spot the patterns your memory forgets.",
    shot: <MockGallery />,
    reverse: true,
  },
];

export function LandingExperience() {
  return (
    <div className="landing-root bg-[#fafafa] text-slate-900">
      <header className="landing-nav fixed inset-x-0 top-0 z-50 bg-[#fafafa]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 to-amber-400 text-xs font-bold text-amber-900">
              Au
            </span>
            <span className="text-lg font-semibold tracking-tight">XAUJournal</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <a href="#dashboard" className="hover:text-slate-900">
              Dashboard
            </a>
            <a href="#journal" className="hover:text-slate-900">
              Journal
            </a>
            <a href="#calendar" className="hover:text-slate-900">
              Calendar
            </a>
            <a href="#gallery" className="hover:text-slate-900">
              Gallery
            </a>
          </nav>
          <div className="flex gap-2">
            <Link href="/login" className="hidden rounded-full px-4 py-2 text-sm text-slate-600 sm:inline-block hover:bg-slate-100">
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Start free
            </Link>
          </div>
        </div>
      </header>

      <main className="landing-scroll pt-14">
        {/* Hero */}
        <section className="landing-section flex min-h-0 items-center py-10 md:py-14">
          <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 lg:grid-cols-2 lg:items-center lg:gap-8">
            <div className="landing-reveal">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Gold trader&apos;s journal</p>
              <h1 className="mt-2 text-4xl font-semibold leading-[1.08] tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                Stay disciplined.
                <br />
                <span className="bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
                  One trade at a time.
                </span>
              </h1>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-slate-600 md:text-lg">
                XAUJournal is a manual, discipline-first workspace for XAUUSD — no broker sync, no noise. Just clarity,
                reflection, and pastel analytics built for serious traders.
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <Link
                  href="/register"
                  className="rounded-full bg-slate-900 px-7 py-3.5 text-sm font-medium text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
                >
                  Start your journal
                </Link>
                <Link
                  href="/login"
                  className="rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Sign in
                </Link>
              </div>
              <p className="mt-3 text-xs text-slate-400">Free tier · 10 trades · No card required</p>
            </div>
            <div className="landing-reveal landing-reveal-delay">
              <DeviceFrame label="xaujournal.app — Dashboard">
                <MockDashboard />
              </DeviceFrame>
            </div>
          </div>
        </section>

        {/* Feature sections */}
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="landing-section flex min-h-0 items-center scroll-mt-16 py-10 md:py-12"
          >
            <div
              className={`mx-auto grid w-full max-w-6xl gap-6 px-6 lg:grid-cols-2 lg:items-center lg:gap-8 ${
                section.reverse ? "lg:[direction:rtl]" : ""
              }`}
            >
              <div className={`landing-reveal space-y-2.5 ${section.reverse ? "lg:[direction:ltr]" : ""}`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{section.eyebrow}</p>
                <h2 className="text-3xl font-semibold leading-tight tracking-tight text-slate-900 md:text-4xl">
                  {section.hook}
                </h2>
                <p className="max-w-md text-base leading-relaxed text-slate-600">{section.body}</p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 text-sm font-medium text-sky-700 transition hover:text-sky-900"
                >
                  Try it free
                  <span aria-hidden>→</span>
                </Link>
              </div>
              <div className={`landing-reveal landing-reveal-delay ${section.reverse ? "lg:[direction:ltr]" : ""}`}>
                <DeviceFrame>{section.shot}</DeviceFrame>
              </div>
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="landing-section flex min-h-0 items-center bg-gradient-to-b from-slate-900 to-slate-800 py-14 text-white md:py-16">
          <div className="landing-reveal mx-auto max-w-3xl px-6 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Built for XAUUSD traders</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Your journal. Your rules. Your edge.</h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-slate-300">
              Join traders who choose manual reflection over autopilot stats — and build discipline that compounds.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/register"
                className="rounded-full bg-white px-8 py-3.5 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
              >
                Create free account
              </Link>
              <Link
                href="/pricing"
                className="rounded-full border border-slate-600 px-8 py-3.5 text-sm font-medium text-white transition hover:border-slate-500"
              >
                View pricing
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#fafafa] py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} XAUJournal · Manual reflection for high discipline Gold trading
      </footer>
    </div>
  );
}
