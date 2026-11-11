import type { CSSProperties } from "react";
import OfficerTools from "./OfficerTools";
import Title from "./Title";

// Both halves are graphics in the social kit's style: real app cards, straight and lifted,
// on a flat emerald panel. Nothing plays in sequence, so the whole thing reads at a glance.

type Card = { file: string; alt: string; w: number; h: number };

// Night one, start to finish in 20 minutes: the real onboarding pages, all the same size.
const STEPS: { when: string; title: string; line: string; card: Card }[] = [
  {
    when: "9:00 PM",
    title: "Start your chapter",
    line: "Pick your org type, name it and set the roles.",
    card: { file: "onb-type", alt: "What kind of org is it? Fraternity, sorority, honor society, professional, club or other", w: 780, h: 1688 },
  },
  {
    when: "9:05 PM",
    title: "Send each role its code",
    line: "Every role has its own code. It changes every day.",
    card: { file: "onb-invite", alt: "Invite your chapter: a code for each role", w: 780, h: 1688 },
  },
  {
    when: "9:20 PM",
    title: "Everyone joins",
    line: "Type the code and you land in the right role.",
    card: { file: "onb-join", alt: "Join with a code: ten seconds and you are in", w: 780, h: 1688 },
  },
];

const Img = ({ card }: { card: Card }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img className="cr-gfx-card" src={`/kit/${card.file}.webp`} alt={card.alt} width={card.w} height={card.h} loading="lazy" />
);

export default function Setup() {
  return (
    <section id="how" className="cr-section cr-g-ivory">
      <div className="cr-wrap">
        <div className="cr-head" data-reveal>
          <Title text="up and running / in 20 minutes." />
          <p className="cr-sub">Three steps, start to finish.</p>
        </div>
        <div className="cr-gfx-steps" data-reveal>
          <span className="cr-gfx-line" aria-hidden="true" />
          <ol>
            {STEPS.map((s, i) => (
              <li key={s.when} style={{ "--i": i } as CSSProperties}>
                <span className="cr-gfx-when">
                  <span className="cr-gfx-dot" aria-hidden="true" />
                  {s.when}
                </span>
                <b>{s.title}</b>
                <span className="cr-gfx-line-text">{s.line}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="cr-gfx-screen" src={`/kit/${s.card.file}.webp`} alt={s.card.alt} width={s.card.w} height={s.card.h} loading="lazy" />
              </li>
            ))}
          </ol>
        </div>

        <div id="more" className="cr-more" data-reveal>
          <Title text="officer tools, / built in." />
          <p className="cr-sub">Once everyone’s in, this is what officers stop doing by hand.</p>
          <p className="cr-ot-hint">Hover over a tile to see it work.</p>
        </div>
        <OfficerTools />
      </div>
    </section>
  );
}
