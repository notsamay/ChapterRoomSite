const TONES = {
  navy: "bg-navy",
  moss: "bg-moss",
  pine: "bg-pine-light",
  plum: "bg-plum",
  brick: "bg-brick",
} as const;

/**
 * A notification, floated beside a phone to show the app doing things. Glass card, with the
 * app's own content language inside it: initial avatar, title, quiet body line, timestamp.
 * Decorative, so hidden from assistive tech.
 */
export default function FloatingChip({
  initial,
  tone = "navy",
  title,
  body,
  time,
  className = "",
}: {
  initial: string;
  tone?: keyof typeof TONES;
  title: string;
  body: string;
  time: string;
  className?: string;
}) {
  // Feeds (announcements, rush) use the app's rounded-square tile; chats use a circle.
  const shape = tone === "pine" ? "rounded-[11px]" : "rounded-full";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none z-20 min-w-[256px] items-center gap-3 rounded-[18px] border border-cream/15 bg-ink/70 py-2.5 pl-2.5 pr-3.5 text-cream shadow-[0_24px_50px_rgba(0,0,0,0.45)] backdrop-blur-md ${className}`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center text-[15px] font-semibold text-cream ${shape} ${TONES[tone]}`}
      >
        {initial}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-3">
          <span className="truncate text-[13.5px] font-semibold leading-tight">{title}</span>
          <span className="shrink-0 text-[11px] text-cream/45">{time}</span>
        </span>
        <span className="mt-0.5 block truncate text-[12.5px] leading-snug text-cream/60">{body}</span>
      </span>
    </div>
  );
}
