"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * One IntersectionObserver for the whole page rather than one per element — the
 * landing page has ~40 revealed blocks and they all want identical thresholds.
 */
let observer: IntersectionObserver | null = null;

function show(el: Element) {
  el.classList.add("is-visible");
}

function getObserver() {
  if (observer || typeof IntersectionObserver === "undefined") return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        show(entry.target);
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.05 }
  );
  return observer;
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger, in milliseconds. */
  delay?: number;
  /** Transition length, in milliseconds. */
  duration?: number;
  /** How far the element travels on its way in, in pixels. */
  y?: number;
  style?: CSSProperties;
};

export default function Reveal({
  children,
  className = "",
  delay = 0,
  duration = 900,
  y = 28,
  style,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Anything already on screen at mount animates straight away, so the hero plays
    // its entrance on load instead of waiting for a scroll that may never come.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
      show(el);
      return;
    }

    const io = getObserver();
    if (!io) {
      show(el);
      return;
    }
    io.observe(el);

    // Safety net: never leave content invisible because an observer misfired.
    const safety = window.setTimeout(() => show(el), 2500);
    return () => {
      window.clearTimeout(safety);
      io.unobserve(el);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={
        {
          "--reveal-delay": `${delay}ms`,
          "--reveal-duration": `${duration}ms`,
          "--reveal-y": `${y}px`,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
