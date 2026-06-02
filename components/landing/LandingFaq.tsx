"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Is XAUJournal only for XAUUSD (gold)?",
    a: "Yes. Every field, tag, and dashboard view is tuned for gold traders — not a generic multi-asset spreadsheet.",
  },
  {
    q: "Do you sync MT4 or MT5 automatically?",
    a: "Not yet. XAUJournal is discipline-first manual logging: you reflect on each trade with checklist, emotion, and charts. Broker sync may come later on Premium.",
  },
  {
    q: "How is this different from a Notion template?",
    a: "Built-in discipline scoring, equity curve, session heatmaps, and gallery — no setup required. Your data lives in a private journal, not a doc you maintain yourself.",
  },
  {
    q: "What does the free tier include?",
    a: "Up to 10 trade logs, full checklist, dashboard analytics, calendar, and gallery. Upgrade when you need unlimited history.",
  },
  {
    q: "Will animations slow down the app?",
    a: "Landing uses lightweight CSS scroll reveals only. The signed-in dashboard avoids heavy motion so charts stay fast.",
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
