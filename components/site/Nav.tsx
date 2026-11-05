"use client";

import { useState } from "react";
import { STILLS } from "./media";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#more", label: "Officers" },
  { href: "#hierarchy", label: "Roles and groups" },
  { href: "#security", label: "Security" },
  { href: "#events", label: "Events" },
  { href: "#money", label: "Dues" },
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

  return (
    <header className="cr-nav">
      <div className="cr-nav-bar">
        <a href={`${base}#top`} className="cr-brand" aria-label="Chapter Room home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={STILLS.appIcon} alt="" width={30} height={30} />
          <span className="cr-wordmark">chapter room</span>
        </a>
        <nav aria-label="Main" className="cr-nav-links">
          {LINKS.map((l) => (
            <a key={l.href} href={base + l.href}>
              {l.label}
            </a>
          ))}
          <a href={`${base}#join`} className="cr-nav-cta">
            Get the app
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
