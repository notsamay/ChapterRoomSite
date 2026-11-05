"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Whether an element is on screen. `visits` goes up each time it comes back into view,
 * so a timeline or a tab's progress bar can start over from the beginning.
 */
export function useInView<T extends Element>(threshold = 0.35): { ref: RefObject<T>; inView: boolean; visits: number } {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setVisits((v) => v + 1);
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView, visits };
}

/**
 * Tabs that advance on their own once each clip has played through, only while the
 * section is on screen, and stop for good the first time someone picks one.
 */
export function useAutoTabs(durations: number[], active: boolean) {
  const key = durations.join(",");
  const [current, setCurrent] = useState(0);
  const [stopped, setStopped] = useState(false);

  useEffect(() => {
    if (stopped || !active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setCurrent((i) => (i + 1) % durations.length), durations[current]);
    return () => clearTimeout(t);
    // `key` stands in for `durations`, so a new array with the same values doesn't restart the timer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, stopped, active, key]);

  const pick = (i: number) => {
    setStopped(true);
    setCurrent(i);
  };

  return { current, stopped, pick };
}
