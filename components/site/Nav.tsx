"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#more", label: "Officers" },
  { href: "#hierarchy", label: "Roles and groups" },
  { href: "#security", label: "Security" },
  { href: "#events", label: "Events" },
  { href: "#money", label: "Fees" },
];

// Events and Dues are desktop-only sections, so the phone menu leaves them out.
const MENU = LINKS.filter((l) => l.href !== "#events" && l.href !== "#money");

/**
 * The floating dark-glass pill. On phones it shows the wordmark and a menu button.
 * `base` is "/" on other pages, so the links go back to the home page's sections.
 */
export default function Nav({ base = "" }: { base?: string }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Gets out of the way while you read. It hides once you've clearly scrolled down (48px in one
  // direction, so small nudges don't make it flicker), comes back after a short scroll up (16px),
  // is always there near the top of the page, and shows when the mouse goes to the top of the screen.
  const [hidden, setHidden] = useState(false);
  // The nav takes the colour of the section under it: emerald, ivory or black.
  const [ground, setGround] = useState<"emerald" | "ivory" | "black">("emerald");
  useEffect(() => {
    const read = () => {
      const probe = 40; // the middle of the nav bar
      const els = Array.from(document.querySelectorAll<HTMLElement>("main > section, footer"));
      const under = els.find((el) => {
        const r = el.getBoundingClientRect();
        return el.offsetHeight > 0 && r.top <= probe && r.bottom > probe;
      });
      if (!under) return setGround("emerald");
      if (under.tagName === "FOOTER" || under.classList.contains("cr-g-black")) setGround("black");
      else if (under.classList.contains("cr-g-ivory")) setGround("ivory");
      else setGround("emerald");
    };
    let raf = 0;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(() => ((raf = 0), read()));
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  useEffect(() => {
    let last = window.scrollY;
    let run = 0; // distance moved in the current direction
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        const dy = y - last;
        last = y;
        if (y < 120) {
          run = 0;
          setHidden(false);
          return;
        }
        if (!dy) return;
        run = Math.sign(dy) === Math.sign(run) ? run + dy : dy;
        if (run > 48) setHidden(true);
        else if (run < -16) setHidden(false);
      });
    };
    const onMove = (e: MouseEvent) => {
      if (e.clientY < 72) setHidden(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className={`cr-nav${hidden && !open ? " is-hidden" : ""}`} data-ground={ground}>
      <div className="cr-nav-bar">
        <a href={`${base}#top`} className="cr-brand" aria-label="Chapter Room home">
          {/* The castle and wordmark lockup, as at the top of every brand graphic. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <span className="cr-brand-on-dark">
            <img className="cr-lockup" src="/kit/lockup-on-emerald.png" alt="chapter room" width={480} height={74} />
          </span>
          {/* The same lockup for light grounds; the two cross-fade as the nav changes colour. */}
          <span className="cr-brand-on-light" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="cr-lockup-light" src="/kit/lockup-on-ivory.png" alt="" width={480} height={74} />
          </span>
        </a>
        <nav aria-label="Main" className="cr-nav-links">
          {LINKS.map((l) => (
            <a key={l.href} href={base + l.href}>
              {l.label}
            </a>
          ))}
          <a href="/portal" className="cr-nav-cta">
            Web portal
          </a>
          <button
            type="button"
            className="cr-burger"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </nav>
      </div>
      {open && (
        <div className="cr-nav-menu">
          {MENU.map((l) => (
            <a key={l.href} href={base + l.href} onClick={close}>
              {l.label}
            </a>
          ))}
          <a href={`${base}#join`} onClick={close} className="cr-menu-cta">
            Join the waiting room
          </a>
        </div>
      )}
    </header>
  );
}
