"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

// Officer tools: six tiles, all one size, in rows. Each tile shows a still cropped to fit. On a
// computer, hovering a tile blurs the page and shows the entire phone in the middle of the screen,
// playing the full-screen recording (`clip`, 780 × 1688). Moving to another tile swaps it; moving
// off the tiles closes it. Phones and touch screens keep the stills.
const TILES = [
  { clip: "upcoming", poster: "ot-tile-upcoming", pos: "50% 0%", title: "What’s coming up", line: "Overdue first, then the week." },
  { clip: "excuses", poster: "ot-tile-excuses", pos: "50% 0%", title: "Swipe to approve", line: "Excuses, one swipe each. And Undo." },
  { clip: "attend", poster: "ot-attend", pos: "50% 0%", title: "Who showed up", line: "On time, late, excused or missed, for every event." },
  { clip: "paid", poster: "ot-tile-paid", pos: "50% 0%", title: "See who has paid", line: "Every voucher has its own list." },
  { clip: "payouts", poster: "ot-payouts", pos: "50% 0%", title: "Payouts to your bank", line: "Straight to your org’s Stripe account." },
  { clip: "merch", poster: "ot-merch", pos: "50% 40%", title: "Sell merch and tickets", line: "Members pay in the app." },
];

// How long the phone and the blur take to go away; matches the out animations in site.css.
const OUT_MS = 300;

export default function OfficerTools({ children }: { children?: ReactNode }) {
  const canHover = useRef(false);
  const timer = useRef<number>(0);
  const [peek, setPeek] = useState<number | null>(null);
  // While leaving, the phone and the blur animate out; then the layer is removed.
  const [leaving, setLeaving] = useState(false);

  // Closing: after `wait` ms (a grace period, so crossing the gap between two tiles doesn't
  // flicker) the phone and the blur animate out together, then the layer goes.
  const close = (wait = 140) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setLeaving(true);
      timer.current = window.setTimeout(() => {
        setPeek(null);
        setLeaving(false);
      }, OUT_MS);
    }, wait);
  };
  const open = (i: number) => {
    if (!canHover.current) return;
    window.clearTimeout(timer.current);
    setLeaving(false);
    setPeek(i);
  };

  useEffect(() => {
    canHover.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const off = () => close(0);
    window.addEventListener("scroll", off, { passive: true });
    return () => {
      window.removeEventListener("scroll", off);
      window.clearTimeout(timer.current);
    };
  }, []);

  const p = peek === null ? null : TILES[peek];

  return (
    <>
      {children}
      <div className="cr-ot cr-ot-grid" data-reveal onMouseLeave={() => close()}>
        {TILES.map((t, i) => (
          <figure key={t.clip} className="cr-ot-tile" data-peek={peek === i ? "" : undefined} onMouseEnter={() => open(i)} onMouseLeave={() => close()}>
            <div className="cr-ot-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/kit/${t.poster}.webp`} alt={t.title} style={{ objectPosition: t.pos }} />
            </div>
            <figcaption>
              <b>{t.title}</b>
              <span>{t.line}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      {/* The blur and the recording sit over the whole page, but let the pointer through, so the
          tile under it still decides what shows. */}
      {p &&
        createPortal(
          <div className="cr-ot-veil" data-state={leaving ? "out" : "in"} aria-hidden="true">
            <div key={p.clip} className="cr-ot-peek">
              <span className="cr-ot-island" />
              <video src={`/media/${p.clip}.mp4`} poster={`/media/${p.clip}-poster.jpg`} muted loop playsInline autoPlay />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
