import type { CSSProperties } from "react";
import HeroParallax from "./HeroParallax";
import Title from "./Title";
import { WALL_CARDS, type WallCard } from "./wall-cards";

// Three columns of real app cards, dealt out in order of importance.
const COLUMNS: WallCard[][] = [0, 1, 2].map((c) => WALL_CARDS.filter((_, i) => i % 3 === c));

/**
 * The hero is the overview graphic, "run your whole org from one app.": the headline on the left and a
 * wall of real app cards on the right, drifting slowly. Hover a card to bring it forward (the drift
 * pauses and the rest dim); click it to jump to that feature.
 */
export default function Hero() {
  return (
    <section id="top" className="cr-hero cr-g-emerald">
      <div className="cr-hero-wall" aria-hidden="true">
        {COLUMNS.map((col, c) => (
          <div key={c} className="cr-hero-col" style={{ "--c": c } as CSSProperties}>
            {/* Each column is drawn twice so the drift loops without a seam. */}
            <div className="cr-hero-track">
              {/* Each card jumps to the section that shows it. They are shortcuts to links the nav
                  already has, so they stay out of the tab order and the screen-reader view. */}
              {[...col, ...col].map((card, i) => (
                <a key={`${card.file}-${i}`} className="cr-hero-card" href={card.href} tabIndex={-1}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/kit/${card.file}.webp`}
                    alt=""
                    width={card.w}
                    height={card.h}
                    loading={i < 3 ? "eager" : "lazy"}
                    data-dark={card.file.endsWith("dark") ? "" : undefined}
                  />
                  <span className="cr-hero-tag">{card.tag} →</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="cr-hero-in">
        <div className="cr-hero-copy">
          <Title as="h1" className="cr-hero-title" text="run your whole org / from one app." />
          <p className="cr-hero-lead">
            Chats, events with location check-in, membership fees with payment plans, excuses, feeds and albums. Built
            for every student org.
          </p>
          <div className="cr-hero-actions">
            <a href="#join" className="cr-btn">
              <span className="cr-only-desk">Get the app</span>
              <span className="cr-only-phone">Join the waiting room</span>
            </a>
            <a href="#features" className="cr-link">
              See how it works
            </a>
          </div>
          <p className="cr-hero-note">Free for members. Officers set it up in minutes.</p>
        </div>
      </div>
      <HeroParallax />
      <p className="cr-sr">
        Real screens from the app: chats, albums, events, vouchers, feeds, check-in, officer tools, cross-org chats, the
        calendar, the security log, attendance, membership fees, excuses, invite codes and roles.
      </p>
    </section>
  );
}
