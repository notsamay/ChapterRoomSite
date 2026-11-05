"use client";

import type { KeyboardEvent, MouseEvent, ReactNode } from "react";

export const PICK_SCHOOL = "cr:pick-school";

/** Clicking (or pressing Enter on) a school's dot fills it into the waiting-room form. */
export default function MapPicker({ children }: { children: ReactNode }) {
  const pick = (target: EventTarget) => {
    const dot = (target as Element).closest?.("[data-school]");
    const school = dot?.getAttribute("data-school");
    if (school) window.dispatchEvent(new CustomEvent(PICK_SCHOOL, { detail: school }));
  };
  return (
    <div
      className="cr-mapwrap"
      data-reveal
      onClick={(e: MouseEvent) => pick(e.target)}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          pick(e.target);
        }
      }}
    >
      {children}
    </div>
  );
}
