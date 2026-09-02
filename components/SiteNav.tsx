"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/** The wordmark: lowercase Space Grotesk, optically centred on the mark. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`truncate font-wordmark text-[18px] font-bold leading-none tracking-[-0.035em] text-cream ${className}`}
    >
      chapter room
    </span>
  );
}

const LINKS = [
  { href: "#attendance", label: "Attendance" },
  { href: "#roles", label: "Roles" },
  { href: "#chats", label: "Chats" },
  { href: "#locked", label: "Privacy" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // Highlight whichever section is currently under the nav.
  useEffect(() => {
    const sections = LINKS.map((link) => document.querySelector(link.href)).filter(
      (el): el is Element => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Close the sheet on Escape, and whenever the viewport grows past the breakpoint.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const media = window.matchMedia("(min-width: 900px)");
    const onChange = () => media.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    media.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      media.removeEventListener("change", onChange);
    };
  }, [open]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[80] flex justify-center px-5 py-4">
      <div className="pointer-events-auto w-full max-w-nav">
        <div className="flex items-center justify-between gap-3 rounded-full border border-cream/15 bg-ink/60 py-2.5 pl-3.5 pr-2.5 backdrop-blur-[18px] backdrop-saturate-150 min-[900px]:gap-[18px] min-[900px]:pl-[18px] min-[900px]:pr-3">
          <a href="#top" className="flex min-w-0 items-center gap-2" aria-label="Chapter Room, back to top">
            <Image src="/logo-mark.png" alt="" width={34} height={28} className="h-[28px] w-auto" priority />
            <Wordmark className="translate-y-px" />
          </a>

          <div className="hidden items-center gap-[30px] min-[900px]:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={active === link.href ? "true" : undefined}
                className={`text-[14.5px] font-medium transition-colors hover:text-cream ${
                  active === link.href ? "text-cream" : "text-cream/75"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#waitlist"
              className="rounded-full bg-cream px-[22px] py-3 text-[14.5px] font-semibold text-pine transition-colors hover:bg-moss hover:text-cream"
            >
              Get early access
            </a>
          </div>

          <div className="flex items-center gap-2 min-[900px]:hidden">
            <a
              href="#waitlist"
              className="whitespace-nowrap rounded-full bg-cream px-3.5 py-2 text-[13px] font-semibold text-pine transition-colors hover:bg-moss hover:text-cream"
            >
              Early access
            </a>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="nav-sheet"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cream/15 text-cream/80 transition-colors hover:text-cream"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" aria-hidden="true">
                {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div
            id="nav-sheet"
            className="mt-2 overflow-hidden rounded-[26px] border border-cream/15 bg-ink/85 backdrop-blur-[18px] min-[900px]:hidden"
          >
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block border-b border-cream/10 px-6 py-4 text-[15px] font-medium text-cream/80 transition-colors last:border-0 hover:bg-cream/5 hover:text-cream"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
