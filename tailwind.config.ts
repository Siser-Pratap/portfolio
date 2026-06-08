import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
    }
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
