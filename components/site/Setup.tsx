"use client";

import { useEffect, useState, type CSSProperties } from "react";
import AutoVideo from "./AutoVideo";
import { CLIPS } from "./media";
import { useInView } from "./useAutoTabs";

// The three night-one steps play one after another, each for its clip's length plus a beat.
const STEPS = [
  { when: "9:00 PM", title: "Start your chapter", line: "Pick your org type, name it and set the roles.", clip: CLIPS.setupStart, alt: "Starting a chapter: name it, set the roles, then Your chapter is live", ms: 10633 },
  { when: "9:15 PM", title: "Send each role its code", line: "Every role has its own code. It changes every day.", clip: CLIPS.setupCodes, alt: "Invite codes: the New Member code with Share and Copy", ms: 6633 },
  { when: "10:00 PM", title: "Everyone joins", line: "Type the code and you land in the right role.", clip: CLIPS.setupJoin, alt: "Typing a code and joining Acacia Wisconsin as Exec", ms: 6800 },
];

// Officer tools, equal tiles. Phones show the first three.
const TILES = [
  { clip: CLIPS.tileAdmin, alt: "Turning on Admin mode", title: "Tap the shield", line: "Home turns into the Administrator View." },
  { clip: CLIPS.tileUpcoming, alt: "Activities, then the calendar", title: "What’s coming up", line: "Overdue first, then the week." },
  { clip: CLIPS.tileExcuses, alt: "Swiping to approve the first excuse, then Undo", title: "Swipe to approve", line: "Excuses, one swipe each. And Undo." },
  { clip: CLIPS.tilePowers, alt: "Turning on powers for Rush Chair", title: "Powers for every role", line: "Flip on what each officer can do." },
  { clip: CLIPS.tileReports, alt: "Reports: two waiting on you", title: "Handle reports", line: "Flagged messages and posts, in one place." },
  { clip: CLIPS.tilePaid, alt: "Who has paid for the Formal Ticket", title: "See who has paid", line: "Every voucher has its own list." },
];

export default function Setup() {
  const [step, setStep] = useState(0);
  // The timeline waits until it is on screen, and starts from step one each time it comes back.
  const { ref, inView, visits } = useInView<HTMLDivElement>();

  useEffect(() => {
    if (visits > 0) setStep(0);
  }, [visits]);

  useEffect(() => {
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setStep((s) => (s + 1) % STEPS.length), STEPS[step].ms);
    return () => clearTimeout(t);
  }, [step, inView]);

  return (
    <section id="how" className="cr-section" style={{ background: "#FFFFFF" }}>
      <div className="cr-wrap">
        <div className="cr-head" data-reveal>
          <h2 className="cr-h2">up and running in one night.</h2>
          <p className="cr-sub">Three steps, start to finish.</p>
        </div>
        <div ref={ref} style={{ position: "relative" }}>
          <span className="cr-tline-line" aria-hidden="true" />
          <ol className="cr-tline">
          {STEPS.map((s, i) => (
            <li key={s.when} className="cr-step" data-on={i === step} data-reveal style={{ "--i": i } as CSSProperties}>
              <div className="cr-step-when">
                <span className="cr-step-dot" aria-hidden="true" />
                <span className="cr-step-time">{s.when}</span>
              </div>
              <div className="cr-step-clip">
                <AutoVideo clip={s.clip} alt={s.alt} loop={false} playing={inView && i === step} restartKey={`${step}-${visits}`} />
              </div>
              <div className="cr-cap">
                <b>{s.title}</b>
                <span>{s.line}</span>
              </div>
            </li>
          ))}
          </ol>
        </div>

        <div id="more" className="cr-more" data-reveal>
          <h2 className="cr-h2">features that save you hours.</h2>
          <p className="cr-sub">Once everyone’s in, this is what officers stop doing by hand.</p>
        </div>
        <div className="cr-tiles">
          {TILES.map((t, i) => (
            <figure key={t.title} className="cr-tile" data-reveal style={{ "--i": i % 3 } as CSSProperties}>
              <div className="cr-tile-clip">
                <AutoVideo clip={t.clip} alt={t.alt} />
              </div>
              <figcaption className="cr-cap">
                <b>{t.title}</b>
                <span>{t.line}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
