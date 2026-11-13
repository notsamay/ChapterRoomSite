"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useAutoTabs, useInView } from "./useAutoTabs";

// Night one, start to finish in 20 minutes: the real onboarding pages, all the same size. The steps
// play in turn while the page is on screen (hover or tap one to hold it): the step lifts, the rail
// fills to it, and something happens inside the screen, all laid over the real capture at the
// positions measured from it (the captures are 390 × 844 points).
type Card = { file: string; alt: string; w: number; h: number };
const STEPS: { when: string; title: string; card: Card; ms: number }[] = [
  { when: "9:00 PM", title: "Start your chapter", ms: 3200, card: { file: "onb-type", alt: "What kind of org is it? Fraternity, sorority, honor society, professional, club or other", w: 780, h: 1688 } },
  { when: "9:05 PM", title: "Send each role its code", ms: 3600, card: { file: "onb-invite", alt: "Invite your chapter: a code for each role", w: 780, h: 1688 } },
  { when: "9:20 PM", title: "Everyone joins", ms: 3800, card: { file: "onb-join", alt: "Join with a code: ten seconds and you are in", w: 780, h: 1688 } },
];
const DURATIONS = STEPS.map((s) => s.ms);

// Points to percentages of the capture.
const px = (x: number) => `${(x / 390) * 100}%`;
const py = (y: number) => `${(y / 844) * 100}%`;

// Step 2: each role's code appears where it says "Make code" (rows at 274, 346, 418 and 490 pt).
const CODES = [
  { y: 274, code: "EX4H9TNB", bg: "#1a4035" },
  { y: 346, code: "OF7K2QDM", bg: "#163e32" },
  { y: 418, code: "ME9P3XRA", bg: "#143c30" },
  { y: 490, code: "NM2T8WCE", bg: "#143b2f" },
];
// Step 3: a code types itself into the eight boxes (x from the capture, y 316–362 pt).
const BOXES = [43, 81.7, 120.3, 159, 197.7, 236, 274.7, 313.3];
const TYPED = "OF7K2QDM";

function Live({ step }: { step: number }) {
  if (step === 0)
    // The primary button breathes, as the next thing to tap.
    return <span className="cr-live-ring" style={{ left: px(24), top: py(744), width: px(342), height: py(50) }} />;
  if (step === 1)
    return (
      <>
        {CODES.map((c, i) => (
          <span
            key={c.code}
            className="cr-live-code"
            style={{ left: px(282), top: py(c.y - 10), width: px(86), height: py(20), background: c.bg, "--d": `${300 + i * 450}ms` } as CSSProperties}
          >
            {c.code}
          </span>
        ))}
      </>
    );
  return (
    <>
      {BOXES.map((x, i) => (
        <span
          key={x}
          className="cr-live-key"
          style={{ left: px(x), top: py(316), width: px(33.4), height: py(46), "--d": `${300 + i * 160}ms` } as CSSProperties}
        >
          {TYPED[i]}
        </span>
      ))}
      <span className="cr-live-ring cr-live-ring-late" style={{ left: px(24), top: py(748), width: px(342), height: py(50) }} />
    </>
  );
}

export default function SetupSteps() {
  const { ref, inView, visits } = useInView<HTMLDivElement>(0.3);
  const { current, pick } = useAutoTabs(DURATIONS, inView);
  const strip = useRef<HTMLOListElement>(null);
  const moved = useRef(0);
  const pickRef = useRef(pick);
  pickRef.current = pick;
  const currentRef = useRef(current);
  currentRef.current = current;

  // Phones show the steps as a strip you swipe: the strip follows the step that's playing, and
  // swiping to a step picks it (so what plays is always the one in front of you).
  const isStrip = () => window.matchMedia("(max-width: 760px)").matches;
  const centreOf = (el: Element) => {
    const r = el.getBoundingClientRect();
    return r.left + r.width / 2;
  };
  useEffect(() => {
    const ol = strip.current;
    const li = ol?.children[current];
    if (!ol || !li || !isStrip()) return;
    const delta = centreOf(li) - centreOf(ol);
    if (Math.abs(delta) < 4) return;
    moved.current = Date.now();
    ol.scrollBy({ left: delta, behavior: "smooth" });
  }, [current]);
  useEffect(() => {
    const ol = strip.current;
    if (!ol) return;
    let t = 0;
    const settle = () => {
      if (!isStrip() || Date.now() - moved.current < 900) return;
      const mid = centreOf(ol);
      let best = 0;
      let gap = Infinity;
      Array.from(ol.children).forEach((c, i) => {
        const d = Math.abs(centreOf(c) - mid);
        if (d < gap) {
          gap = d;
          best = i;
        }
      });
      if (best !== currentRef.current) pickRef.current(best);
    };
    const onScroll = () => {
      clearTimeout(t);
      t = window.setTimeout(settle, 140);
    };
    ol.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ol.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, []);

  return (
    <div ref={ref} className="cr-how-play" data-reveal style={{ "--on": current } as CSSProperties}>
      <span className="cr-how-rail" aria-hidden="true">
        <span className="cr-how-fill" />
      </span>
      <ol ref={strip} className="cr-how-steps">
      {STEPS.map((s, i) => (
        <li
          key={s.when}
          data-on={i === current}
          data-done={i < current}
          onMouseEnter={() => pick(i)}
          onClick={() => pick(i)}
          style={{ "--i": i } as CSSProperties}
        >
          <span className="cr-how-dot" aria-hidden="true" />
          <div className="cr-how-label">
            <span className="cr-how-time">{s.when}</span>
            <b>{s.title}</b>
          </div>
          {/* The capture in a phone: black frame, side buttons, Dynamic Island. The overlays sit on
              the glass, in the capture's own coordinates. */}
          <div className="cr-how-frame">
            <span className="cr-phone-btn" data-side="l" data-b="action" aria-hidden="true" />
            <span className="cr-phone-btn" data-side="l" data-b="up" aria-hidden="true" />
            <span className="cr-phone-btn" data-side="l" data-b="down" aria-hidden="true" />
            <span className="cr-phone-btn" data-side="r" data-b="side" aria-hidden="true" />
            <div className="cr-how-glass">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="cr-how-screen" src={`/kit/${s.card.file}.webp`} alt={s.card.alt} width={s.card.w} height={s.card.h} loading="lazy" />
              {/* Keyed so the step's motion starts over each time it comes round. */}
              {i === current && (
                <span key={`${current}-${visits}`} className="cr-live" aria-hidden="true">
                  <Live step={i} />
                </span>
              )}
              <span className="cr-how-island" aria-hidden="true" />
            </div>
          </div>
        </li>
      ))}
      </ol>
    </div>
  );
}
