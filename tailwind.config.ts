import type { Config } from "tailwindcss";

/**
 * `u` is one pixel of a 300px-wide reference phone screen.
 *
 * The in-app mockups are authored against that reference; inside a `.phone-ui` the
 * `--u` custom property resolves to the frame's real width / 300, so a whole screen
 * scales with its phone. Outside a phone `--u` falls back to `1px` (see globals.css),
 * which makes these classes behave like ordinary pixel values.
 */
const uScale = (steps: number) =>
  Object.fromEntries(
    Array.from({ length: steps + 1 }, (_, i) => [`u${i}`, `calc(var(--u) * ${i})`] as const)
  );

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
        steel: "#9FB0CC",
      },
      fontFamily: {
        // Bricolage carries the two poster statements; Cabinet does section headings.
        display: ["var(--font-bricolage)", "Cabinet Grotesk", "system-ui", "sans-serif"],
        head: ["Cabinet Grotesk", "var(--font-bricolage)", "system-ui", "sans-serif"],
        sans: ["General Sans", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        wordmark: ["var(--font-space)", "Space Grotesk", "system-ui", "sans-serif"],
      },
      spacing: uScale(140),
      fontSize: uScale(60),
      borderRadius: uScale(60),
      maxWidth: { "container": "1180px", "container-wide": "1220px", "nav": "1140px" },
      transitionTimingFunction: { reveal: "cubic-bezier(0.2, 0.7, 0.2, 1)" },
      keyframes: {
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        pulseSoft: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.3" } },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
