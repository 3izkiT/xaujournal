"use client";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "calendar", label: "Calendar" },
  { id: "analytics", label: "Analytics" },
] as const;

export function DashboardSectionNav() {
  return (
    <nav
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Dashboard sections"
    >
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className="shrink-0 rounded-full border border-xau-border bg-xau-card px-3.5 py-1.5 text-xs font-medium text-xau-muted transition hover:border-xau-gold-accent/40 hover:text-xau-ink"
        >
          {section.label}
        </a>
      ))}
    </nav>
  );
}
