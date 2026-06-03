"use client";

import { useState } from "react";
import { BRAND_NAME } from "@/lib/brand";

const faqs = [
  {
    q: "Why manual logging instead of MT5 sync?",
    a: `Because your edge lives in decisions, not copy-paste. ${BRAND_NAME} is built for traders who choose to reflect on each trade — discipline checklist, emotion, and chart study. We do not offer broker auto-sync.`,
  },
  {
    q: `Is ${BRAND_NAME} only for XAUUSD (gold)?`,
    a: "Yes — the product, analytics, and workflow are designed around gold. That focus keeps the journal calm and relevant for XAU traders.",
  },
  {
    q: "Do profit and loss colors match TradingView?",
    a: "Yes. Green (#089981) and red (#f23645) match TradingView defaults, in both light and dark mode, so P&L feels familiar on every screen.",
  },
  {
    q: "What does the free tier include?",
    a: "Up to 10 intentional trade logs with full checklist scoring, dashboard, calendar, gallery, and analytics — no card required.",
  },
  {
    q: "Who is this for?",
    a: "Traders who believe logging on purpose builds discipline and long-term improvement — not traders who only want autopilot statistics.",
  },
];

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-xau-border rounded-2xl border border-xau-border bg-xau-card">
      {faqs.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.q}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : index)}
            >
              <span className="text-sm font-medium text-xau-ink md:text-base">{item.q}</span>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-xau-app text-lg leading-none text-xau-muted transition-transform ${
                  open ? "rotate-45" : ""
                }`}
                aria-hidden
              >
                +
              </span>
            </button>
            {open && <p className="px-5 pb-4 text-sm leading-relaxed text-xau-muted">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
