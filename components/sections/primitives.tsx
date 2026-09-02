import type { ReactNode } from "react";

/** The small uppercase label that opens every section. */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mb-[22px] text-[12.5px] font-semibold uppercase tracking-[0.16em] ${className}`}>{children}</div>
  );
}

/** Section headings — Cabinet Grotesk, tight leading, negative tracking. */
export const H2 = "font-head text-[clamp(34px,4.8vw,68px)] font-extrabold leading-[0.96] tracking-[-0.045em] text-balance";
export const H2_WIDE = "font-head text-[clamp(34px,5.2vw,76px)] font-extrabold leading-[0.95] tracking-[-0.05em] text-balance";

/** The vertical rhythm every band shares. */
export const BAND = "px-6 py-[clamp(80px,10vw,130px)]";

/**
 * A phone's slot in a row.
 *
 * On desktop the phones share the row equally up to their design width, exactly as the
 * prototype lays them out. Below `md` the row becomes a snap-scrolling rail and each
 * phone holds a readable fixed width instead of being crushed to a third of a
 * phone-sized viewport.
 */
export function PhoneSlot({
  children,
  max,
  railWidth = 240,
}: {
  children: ReactNode;
  max: number;
  railWidth?: number;
}) {
  return (
    <div
      className="w-[var(--rail-w)] shrink-0 md:w-full md:min-w-0 md:max-w-[var(--slot-max)] md:flex-1"
      style={{ ["--rail-w" as string]: `${railWidth}px`, ["--slot-max" as string]: `${max}px` }}
    >
      {children}
    </div>
  );
}
