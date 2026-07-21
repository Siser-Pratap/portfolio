import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: '#0D0505',
        foreground: '#FFFFFF',
        primaryColor: '#FF4B1F',
        accentOrange: '#FF6A21',
      },
      keyframes: {
        "slot-shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "blob-drift": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -40px) scale(1.08)" },
          "66%": { transform: "translate(-25px, 25px) scale(0.95)" },
        },
      },
      animation: {
        "spin-slow": "spin 12s linear infinite",
        "slot-shimmer": "slot-shimmer 1.4s ease-in-out infinite",
        "blob-drift": "blob-drift 20s ease-in-out infinite",
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
