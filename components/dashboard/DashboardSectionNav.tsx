"use client";

export const DASHBOARD_TABS = [
  { id: "overview", label: "Overview" },
  { id: "calendar", label: "Calendar" },
  { id: "analytics", label: "Analytics" },
] as const;

export type DashboardTab = (typeof DASHBOARD_TABS)[number]["id"];

export function isDashboardTab(value: string): value is DashboardTab {
  return DASHBOARD_TABS.some((tab) => tab.id === value);
}

type Props = {
  active: DashboardTab;
  onChange: (tab: DashboardTab) => void;
};

export function DashboardSectionNav({ active, onChange }: Props) {
  return (
    <nav
      className="flex gap-1 overflow-x-auto border-b border-xau-border [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Dashboard sections"
      role="tablist"
    >
      {DASHBOARD_TABS.map((section) => {
        const isActive = active === section.id;
        const panelId = `dashboard-panel-${section.id}`;
        return (
          <button
            key={section.id}
            type="button"
            role="tab"
            id={`dashboard-tab-${section.id}`}
            aria-selected={isActive}
            aria-controls={panelId}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(section.id)}
            className={`relative shrink-0 px-4 py-2.5 text-sm font-medium transition ${
              isActive
                ? "text-xau-ink after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-xau-gold-accent"
                : "text-xau-muted hover:text-xau-ink"
            }`}
          >
            {section.label}
          </button>
        );
      })}
    </nav>
  );
}
