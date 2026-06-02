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
          app: "#F9F9FB",
          card: "#FFFFFF",
          ink: "#2D3142",
          muted: "#6B7280",
          border: "#EDEDED",
          mint: "#E2F0D9",
          rose: "#FADBD8",
          calm: "#E1EBF5",
          gold: "#E8D7A5",
          "gold-accent": "#E5C158",
          "gold-soft": "#F5F0E3",
          profit: "#4A6354",
          loss: "#7D5A56",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(45, 49, 66, 0.04), 0 4px 16px rgba(45, 49, 66, 0.04)",
      },
    },
  },
  plugins: [],
} satisfies Config;
