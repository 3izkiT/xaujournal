"use client";

import { useState } from "react";
import { landingFaqs } from "@/lib/landing-faq-data";

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-xau-border rounded-2xl border border-xau-border bg-xau-card">
      {landingFaqs.map((item, index) => {
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
