import type { ReactNode } from "react";

/**
 * Shared furniture for the in-app mockups.
 *
 * Every screen is authored against a 300 x ~620 reference phone and sized entirely in
 * `u-*` classes (see tailwind.config.ts), so a screen holds its proportions whether it's
 * rendered in a 322px hero phone or a 260px card phone.
 */

export function Screen({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`phone-ui flex flex-col overflow-hidden ${className}`}>{children}</div>;
}

export function StatusBar({ time = "6:58", tone = "light" }: { time?: string; tone?: "light" | "dark" }) {
  const color = tone === "light" ? "text-cream" : "text-ink";
  return (
    <div className={`flex shrink-0 items-center justify-between px-u22 pb-u6 pt-u14 ${color}`}>
      <span className="text-u12 font-semibold tabular-nums">{time}</span>
      <div className="flex items-center gap-u5 opacity-90">
        <svg viewBox="0 0 18 12" className="h-u10 w-u15" fill="currentColor" aria-hidden="true">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" opacity="0.4" />
        </svg>
        <svg viewBox="0 0 16 12" className="h-u10 w-u13" fill="currentColor" aria-hidden="true">
          <path d="M8 11.2 5.4 8.6a3.7 3.7 0 0 1 5.2 0L8 11.2Z" />
          <path d="M8 6.1a6.6 6.6 0 0 0-4.7 2L1.9 6.7a8.6 8.6 0 0 1 12.2 0l-1.4 1.4A6.6 6.6 0 0 0 8 6.1Z" opacity="0.75" />
          <path d="M8 1.4A11.2 11.2 0 0 0 .1 4.7L1.5 6.1a9.2 9.2 0 0 1 13 0l1.4-1.4A11.2 11.2 0 0 0 8 1.4Z" opacity="0.5" />
        </svg>
        <svg viewBox="0 0 26 12" className="h-u10 w-u22" fill="none" aria-hidden="true">
          <rect x="0.6" y="0.6" width="21" height="10.8" rx="3" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <rect x="2.2" y="2.2" width="15" height="7.6" rx="1.8" fill="currentColor" />
          <path d="M23.4 4.2v3.6a2 2 0 0 0 0-3.6Z" fill="currentColor" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

export function AppBar({
  title,
  subtitle,
  leading,
  trailing,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex shrink-0 items-center gap-u10 px-u18 pb-u12 pt-u6">
      {leading}
      <div className="min-w-0 flex-1">
        <div className="truncate text-u17 font-semibold leading-tight tracking-[-0.01em]">{title}</div>
        {subtitle ? <div className="truncate text-u11 text-cream/50">{subtitle}</div> : null}
      </div>
      {trailing}
    </div>
  );
}

export function BackChevron() {
  return (
    <svg viewBox="0 0 24 24" className="h-u18 w-u18 text-cream/80" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

const AVATAR_TONES = ["bg-moss", "bg-brick", "bg-steel/80", "bg-sage", "bg-plum-light", "bg-navy-light"];

export function Avatar({ initials, size = 32, index = 0 }: { initials: string; size?: number; index?: number }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-cream ${AVATAR_TONES[index % AVATAR_TONES.length]}`}
      style={{
        width: `calc(var(--u) * ${size})`,
        height: `calc(var(--u) * ${size})`,
        fontSize: `calc(var(--u) * ${Math.round(size * 0.38)})`,
      }}
    >
      {initials}
    </span>
  );
}

export function Pill({
  children,
  tone = "moss",
}: {
  children: ReactNode;
  tone?: "moss" | "brick" | "cream" | "muted" | "sage";
}) {
  const tones = {
    moss: "bg-moss text-cream",
    brick: "bg-brick/25 text-brick",
    cream: "bg-cream text-pine",
    sage: "bg-sage/20 text-sage",
    muted: "bg-cream/10 text-cream/65",
  } as const;
  return (
    <span className={`inline-flex items-center rounded-full px-u9 py-u3 text-u9 font-semibold uppercase tracking-[0.08em] ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-u18 border border-cream/[0.07] bg-cream/[0.06] p-u14 ${className}`}>{children}</div>;
}

/** The five-tab bar every screen sits on, plus the home indicator. */
export function TabBar({ active = 0 }: { active?: number }) {
  const tabs = [
    { label: "Feed", path: "M4 5h16M4 12h16M4 19h10" },
    { label: "Events", path: "M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v12A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-12ZM4 10h16M8.5 3v4M15.5 3v4" },
    { label: "Chats", path: "M20 12a7 7 0 0 1-9.9 6.4L4 20l1.6-5.3A7 7 0 1 1 20 12Z" },
    { label: "Albums", path: "M4 7a2 2 0 0 1 2-2h3l1.5-2h3L15 5h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Zm8 3.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" },
    { label: "You", path: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20a7 7 0 0 1 14 0" },
  ];
  return (
    <div className="mt-auto shrink-0 border-t border-cream/10 bg-ink/40 px-u10 pb-u8 pt-u9 backdrop-blur">
      <div className="flex items-end justify-between">
        {tabs.map((tab, i) => (
          <div key={tab.label} className={`flex flex-1 flex-col items-center gap-u4 ${i === active ? "text-cream" : "text-cream/35"}`}>
            <svg viewBox="0 0 24 24" className="h-u19 w-u19" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={tab.path} />
            </svg>
            <span className="text-u8 font-medium">{tab.label}</span>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-u8 h-u4 w-u102 rounded-full bg-cream/35" />
    </div>
  );
}

export function Icon({ path, className = "h-u16 w-u16", strokeWidth = 1.8 }: { path: string; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

export const ICONS = {
  pin: "M12 21s-7-5.1-7-11a7 7 0 1 1 14 0c0 5.9-7 11-7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  check: "m5 13 4 4L19 7",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3.2 1.9",
  shield: "M12 3 5 6v5.5c0 4.3 2.9 8.2 7 9.5 4.1-1.3 7-5.2 7-9.5V6l-7-3Z",
  bell: "M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6ZM10.3 20a2 2 0 0 0 3.4 0",
  x: "M18 6 6 18M6 6l12 12",
  plus: "M12 5v14M5 12h14",
  chevron: "m9 6 6 6-6 6",
  camera: "M4 8a2 2 0 0 1 2-2h1.6l1.2-2h6.4l1.2 2H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Zm8 2.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z",
  ticket: "M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8ZM10 6v12",
  lock: "M6 11h12v9H6v-9Zm2.5 0V7.5a3.5 3.5 0 0 1 7 0V11",
  send: "m4 12 16-8-5.5 16-2.8-6.4L4 12Z",
} as const;
