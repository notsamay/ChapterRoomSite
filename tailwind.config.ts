import type { Config } from "tailwindcss";

// Tailwind now only styles the legal pages; the home page uses app/site.css.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pine: { DEFAULT: "#123A2E", light: "#1B5340", deep: "#0B241C" },
        ink: { DEFAULT: "#0B120E", soft: "#141C17" },
        bone: "#FBF8F1",
        cream: "#F6F2E9",
        moss: { DEFAULT: "#4E7A54", light: "#5F9066" },
        sage: "#8FBF98",
        navy: { DEFAULT: "#273043", light: "#333E56" },
        plum: { DEFAULT: "#4D2D3B", light: "#63394B" },
        brick: { DEFAULT: "#B0433C", light: "#D9675F", deep: "#8E3730" },
      },
      fontFamily: {
        // Cabinet Grotesk for headlines and the wordmark, Commissioner for everything else.
        display: ["var(--font-cabinet)", "Cabinet Grotesk", "system-ui", "sans-serif"],
        head: ["var(--font-cabinet)", "Cabinet Grotesk", "system-ui", "sans-serif"],
        sans: ["var(--font-commissioner)", "Commissioner", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        wordmark: ["var(--font-cabinet)", "Cabinet Grotesk", "system-ui", "sans-serif"],
      },
      maxWidth: { container: "1180px" },
    },
  },
  plugins: [],
};
export default config;
