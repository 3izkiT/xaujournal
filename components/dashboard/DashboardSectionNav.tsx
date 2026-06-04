"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "calendar", label: "Calendar" },
  { id: "analytics", label: "Analytics" },
] as const;

export function DashboardSectionNav() {
  const [active, setActive] = useState<string>("overview");

  useEffect(() => {
    const ids = sections.map((s) => s.id);
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.15, 0.4] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className="flex gap-1 overflow-x-auto border-b border-xau-border [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Dashboard sections"
    >
      {sections.map((section) => {
        const isActive = active === section.id;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={() => setActive(section.id)}
            className={`relative shrink-0 px-4 py-2.5 text-sm font-medium transition ${
              isActive
                ? "text-xau-ink after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-xau-gold-accent"
                : "text-xau-muted hover:text-xau-ink"
            }`}
            aria-current={isActive ? "true" : undefined}
          >
            {section.label}
          </a>
        );
      })}
    </nav>
  );
}
