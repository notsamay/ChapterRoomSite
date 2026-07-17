import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pine: "#1C362D",
        "pine-deep": "#142720",
        "pine-soft": "#25453A",
        cream: "#F4ECDA",
        "cream-dim": "#E4D9C0",
        sage: "#9DB5A6",
        gold: "#C9A24B",
        plum: "#4D2D3B",
        navy: "#273043",
      },
      fontFamily: {
        slab: ["var(--font-slab)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
