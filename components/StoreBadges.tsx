function AppleIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.86-3.08.38-1.09-.5-2.09-.52-3.24 0-1.44.62-2.2.44-3.06-.38C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M3.61 1.81a1.9 1.9 0 0 0-.61 1.4v17.58a1.9 1.9 0 0 0 .61 1.4l.09.08L13.6 12.4v-.23L3.7 1.73l-.09.08z" />
      <path d="M17.1 15.9l-3.5-3.5v-.23l3.5-3.5.08.05 4.15 2.36c1.19.67 1.19 1.77 0 2.45l-4.15 2.35-.08.02z" opacity=".9" />
      <path d="M17.18 15.85L13.6 12.28 3.61 22.27c.39.42 1.04.47 1.77.06l11.8-6.48" opacity=".7" />
      <path d="M17.18 8.7L5.38 2.24c-.73-.42-1.38-.36-1.77.06l9.99 9.98 3.58-3.58z" opacity=".8" />
    </svg>
  );
}

export default function StoreBadges({ variant = "dark" }: { variant?: "dark" | "light" }) {
  // dark = badges sit on pine background, light = badges sit on cream background
  const base =
    "group flex items-center gap-3.5 rounded-2xl px-6 py-3.5 min-w-[210px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-gold focus-visible:outline-offset-2";
  const style =
    variant === "dark"
      ? "bg-cream text-pine shadow-lg shadow-black/20"
      : "bg-pine text-cream shadow-lg shadow-pine/20";

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <a href="#notify" className={`${base} ${style}`} aria-label="Coming soon to the App Store">
        <AppleIcon className="w-8 h-8 shrink-0" />
        <span className="text-left leading-tight">
          <span className="block font-mono text-[10px] uppercase tracking-[0.16em] opacity-70">
            Coming soon to the
          </span>
          <span className="block font-slab text-lg">App Store</span>
        </span>
      </a>
      <a href="#notify" className={`${base} ${style}`} aria-label="Coming soon to Google Play">
        <PlayIcon className="w-7 h-7 shrink-0" />
        <span className="text-left leading-tight">
          <span className="block font-mono text-[10px] uppercase tracking-[0.16em] opacity-70">
            Coming soon to
          </span>
          <span className="block font-slab text-lg">Google Play</span>
        </span>
      </a>
    </div>
  );
}
