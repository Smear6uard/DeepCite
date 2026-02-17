import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        foreground: "var(--foreground)",
        "text-primary": "var(--text)",
        "text-muted": "var(--text-muted)",
        "text-dim": "var(--muted)",
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          glow: "var(--accent-glow)",
        },
        border: {
          DEFAULT: "var(--border)",
          light: "var(--border-light)",
          hover: "var(--border-hover)",
        },
        error: "#ff4444",
      },
      fontFamily: {
        mono: [
          "var(--font-ibm-plex-mono)",
          "IBM Plex Mono",
          "SF Mono",
          "Menlo",
          "monospace",
        ],
      },
      maxWidth: {
        chat: "900px",
      },
      keyframes: {
        blink: {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 8px var(--accent-glow)" },
          "50%": { boxShadow: "0 0 16px var(--accent-glow)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        blink: "blink 1s infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.2s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
