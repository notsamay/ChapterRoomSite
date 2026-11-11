"use client";

import type { ReactNode } from "react";
import Phone from "./Phone";
import Title from "./Title";
import type { Clip } from "./media";
import { useAutoTabs, useInView } from "./useAutoTabs";

export type ShowcaseTab = {
  title: string;
  line: string;
  clip: Clip;
  alt: string;
  /** Label for the 3 × 2 button grid on phones. */
  short?: string;
  /** The line under the recording on phones, when it should say more than `line`. */
  caption?: string;
  /** Milliseconds before the next tab plays: the clip's length plus a beat. */
  ms: number;
};

/** Tab cards on one side, a green stage with one recording on the other. */
export default function Showcase({
  id,
  title,
  subtitle,
  tabs,
  flip = false,
  phoneGrid = false,
  hideOnPhone = false,
  ground = "ivory",
  children,
}: {
  id: string;
  title: string;
  subtitle: string;
  tabs: ShowcaseTab[];
  flip?: boolean;
  phoneGrid?: boolean;
  hideOnPhone?: boolean;
  /** Which brand ground the section sits on. */
  ground?: "ivory" | "emerald";
  children?: ReactNode;
}) {
  // Nothing cycles until the section is on screen; coming back starts the tab over.
  const { ref, inView, visits } = useInView<HTMLElement>();
  const { current, stopped, pick } = useAutoTabs(tabs.map((t) => t.ms), inView);
  const tab = tabs[current];

  const list = (
    <div role="tablist" aria-label={title.replace(" / ", " ")} className={`cr-tabs ${phoneGrid ? "cr-tabs-grid" : "cr-tabs-scroll"}`}>
      {tabs.map((t, i) => {
        const on = i === current;
        return (
          <button key={t.title} type="button" role="tab" aria-selected={on} onClick={() => pick(i)} className="cr-tab">
            <span className="cr-tab-title">{t.title}</span>
            <span className="cr-tab-short">{t.short ?? t.title}</span>
            {on && (
              <>
                <span className="cr-tab-line">{t.line}</span>
                <span
                  key={`${current}-${stopped}-${visits}`}
                  aria-hidden="true"
                  className="cr-tab-bar"
                  style={{
                    animationDuration: stopped ? "0s" : `${t.ms / 1000}s`,
                    animationPlayState: inView || stopped ? "running" : "paused",
                  }}
                />
              </>
            )}
          </button>
        );
      })}
    </div>
  );

  const stage = (
    <div className="cr-stage">
      <div className="cr-stage-glow" aria-hidden="true" />
      <div className="cr-stage-in">
        <Phone key={`${current}-${visits}`} clip={tab.clip} alt={tab.alt} width={300} animate />
      </div>
    </div>
  );

  return (
    <section ref={ref} id={id} className={`cr-section cr-g-${ground}${hideOnPhone ? " cr-hide-phone" : ""}`}>
      <div className="cr-wrap">
        <div className="cr-head" data-reveal>
          <Title text={title} />
          <p className="cr-sub">{subtitle}</p>
        </div>
        <div className="cr-show" data-reveal>
          {flip ? stage : list}
          {flip ? list : stage}
          <p key={current} className="cr-caption">
            {tab.caption ?? tab.line}
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}
