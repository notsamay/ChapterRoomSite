"use client";

import type { ReactNode } from "react";
import { useAutoTabs, useInView } from "./useAutoTabs";

// The officer web portal in a plain browser window: real captures of its pages (the sample org,
// light theme, 1440 × 900), stepping from one to the next while the window is on screen. Picking a
// tab stops the stepping, as the other tabbed graphics on the site do.

import type { PortalShot } from "./portal-shots";

export default function PortalTour({ shots, children, step = 3800 }: { shots: PortalShot[]; children?: ReactNode; step?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const { current, pick } = useAutoTabs(
    shots.map(() => step),
    inView
  );
  const on = shots[current];

  return (
    <div ref={ref} className="cr-pt">
      <div className="cr-pt-window" role="img" aria-label={`The web portal, ${on.label}. ${on.alt}`}>
        <div className="cr-pt-bar" aria-hidden="true">
          <i />
          <i />
          <i />
          <span className="cr-pt-url">joinchapterroom.com/portal</span>
        </div>
        <div className="cr-pt-screen">
          {shots.map((s, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={s.id} src={`/kit/portal/${s.id}.webp`} alt="" width={2000} height={1250} loading="lazy" data-on={i === current} />
          ))}
        </div>
      </div>
      <div className="cr-pt-foot">
        <div className="cr-pt-tabs" role="tablist" aria-label="Portal pages">
          {shots.map((s, i) => (
            <button key={s.id} type="button" role="tab" aria-selected={i === current} onClick={() => pick(i)}>
              {s.label}
            </button>
          ))}
        </div>
        {children && <div className="cr-pt-actions">{children}</div>}
      </div>
    </div>
  );
}
