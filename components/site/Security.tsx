"use client";

import Phone from "./Phone";
import Title from "./Title";
import { CLIPS } from "./media";
import { useAutoTabs, useInView } from "./useAutoTabs";

const LEVELS = [
  {
    title: "Off",
    line: "Nothing is tracked. Screenshots and saving work like any other app. For the everyday group chat.",
    clip: CLIPS.secOff,
    alt: "An everyday chapter chat with security Off",
    ms: 6500,
  },
  {
    title: "Medium",
    line: "Chapter Room notices every screenshot. A notice goes in the chat, saying who took it, and officers see it in Needs attention. Saving photos is logged too.",
    clip: CLIPS.secMedium,
    alt: "A screenshot logged in the chat",
    ms: 6400,
  },
  {
    title: "Max",
    line: "Everything in Medium, plus the viewer’s own name is tiled over every message and photo, so any picture of the screen shows who took it. Nobody can save photos out, officers included.",
    clip: CLIPS.secMax,
    alt: "Raising Pledge Class from Medium to Max, and the name watermark appears",
    ms: 8500,
  },
];
const DURATIONS = LEVELS.map((l) => l.ms);

export default function Security() {
  const { ref, inView, visits } = useInView<HTMLElement>();
  const { current, stopped, pick } = useAutoTabs(DURATIONS, inView);
  const level = LEVELS[current];

  return (
    <section ref={ref} id="security" className="cr-section cr-page cr-g-black cr-on-dark">
      <div className="cr-wrap cr-split">
        <div className="cr-split-l">
          <div className="cr-head" data-reveal>
            <Title text="what’s said in the room / stays in the room." />
            <p className="cr-sub">
              Every chat, feed and album has its own security level. Officers pick Off, Medium or Max, and everyone in
              the space sees the level at the top of it.
            </p>
          </div>
          <div role="tablist" aria-label="Security levels" className="cr-tabs cr-tabs-dark cr-tabs-scroll" data-reveal>
            {LEVELS.map((l, i) => {
              const on = i === current;
              return (
                <button key={l.title} type="button" role="tab" aria-selected={on} onClick={() => pick(i)} className="cr-tab">
                  <span className="cr-tab-title">{l.title}</span>
                  {on && (
                    <>
                      <span className="cr-tab-line">{l.line}</span>
                      <span
                        key={`${current}-${stopped}-${visits}`}
                        aria-hidden="true"
                        className="cr-tab-bar"
                        style={{
                          animationDuration: stopped ? "0s" : `${l.ms / 1000}s`,
                          animationPlayState: inView || stopped ? "running" : "paused",
                        }}
                      />
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="cr-sec-panel cr-split-r" data-reveal>
          <div className="cr-sec-glow" aria-hidden="true" />
          <div className="cr-sec-stage">
            <Phone key={`${current}-${visits}`} clip={level.clip} alt={level.alt} width={345} animate />
          </div>
        </div>
      </div>
    </section>
  );
}
