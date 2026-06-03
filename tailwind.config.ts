import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        xau: {
          app: "var(--xau-app)",
          card: "var(--xau-card)",
          ink: "var(--xau-ink)",
          muted: "var(--xau-muted)",
          border: "var(--xau-border)",
          profit: "var(--xau-profit)",
          loss: "var(--xau-loss)",
          "profit-bg": "var(--xau-profit-bg)",
          "loss-bg": "var(--xau-loss-bg)",
          calm: "var(--xau-calm-bg)",
          /* legacy aliases */
          mint: "var(--xau-profit-bg)",
          rose: "var(--xau-loss-bg)",
          gold: "var(--xau-gold)",
          "gold-accent": "var(--xau-gold-accent)",
          "gold-soft": "var(--xau-gold-soft)",
        },
      },
      boxShadow: {
        card: "var(--xau-shadow-card)",
      },
    },
  },
  plugins: [],
} satisfies Config;
