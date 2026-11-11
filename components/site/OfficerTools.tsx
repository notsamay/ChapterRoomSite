"use client";

import { useEffect, useRef, type SyntheticEvent } from "react";

// Officer tools: six tiles, all one size, in rows. On a computer, hovering a tile plays its clip
// (real recordings of the app); on phones and touch screens they stay as stills.
const TILES = [
  { clip: "tile-upcoming", poster: "ot-tile-upcoming", pos: "50% 0%", title: "What’s coming up", line: "Overdue first, then the week." },
  { clip: "tile-excuses", poster: "ot-tile-excuses", pos: "50% 0%", title: "Swipe to approve", line: "Excuses, one swipe each. And Undo." },
  { clip: "attend", poster: "ot-attend", pos: "50% 0%", title: "Who showed up", line: "On time, late, excused or missed, for every event." },
  { clip: "tile-paid", poster: "ot-tile-paid", pos: "50% 0%", title: "See who has paid", line: "Every voucher has its own list." },
  { clip: "payouts", poster: "ot-payouts", pos: "50% 0%", title: "Payouts to your bank", line: "Straight to your org’s Stripe account." },
  { clip: "merch", poster: "ot-merch", pos: "50% 62%", title: "Sell merch and tickets", line: "Members pay in the app." },
];

export default function OfficerTools() {
  const canHover = useRef(false);
  useEffect(() => {
    canHover.current =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const play = (e: SyntheticEvent<HTMLElement>) => {
    if (!canHover.current) return;
    const v = e.currentTarget.querySelector("video");
    if (v) v.play().catch(() => {});
  };
  // Back to the still: load() resets the video to its poster.
  const stop = (e: SyntheticEvent<HTMLElement>) => {
    const v = e.currentTarget.querySelector("video");
    if (v && !v.paused) {
      v.pause();
      v.load();
    }
  };

  return (
    <div className="cr-gfx cr-ot" data-reveal>
      {TILES.map((t) => (
        <figure key={t.clip} className="cr-ot-tile" onMouseEnter={play} onMouseLeave={stop}>
          <div className="cr-ot-media">
            <video
              src={`/media/${t.clip}.mp4`}
              poster={`/kit/${t.poster}.webp`}
              muted
              loop
              playsInline
              preload="none"
              aria-label={t.title}
              style={{ objectPosition: t.pos }}
            />
          </div>
          <figcaption>
            <b>{t.title}</b>
            <span>{t.line}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
