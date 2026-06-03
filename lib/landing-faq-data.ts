import { BRAND_NAME } from "@/lib/brand";

export const landingFaqs = [
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
    q: "How do I sign up?",
    a: `Use Continue with Google on the sign-in page — one click, no password. We use Google sign-in only during early access (no email/password registration).`,
  },
  {
    q: "Is it free?",
    a: "During early access, every feature is free: unlimited trade logs, dashboard, calendar, gallery, analytics, and discipline scoring — no card required.",
  },
  {
    q: "Who is this for?",
    a: "Traders who believe logging on purpose builds discipline and long-term improvement — not traders who only want autopilot statistics.",
  },
] as const;
