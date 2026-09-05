"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * One IntersectionObserver for the whole page rather than one per element — the
 * landing page has ~40 revealed blocks and they all want identical thresholds.
 */
let observer: IntersectionObserver | null = null;

/** Share of the element that must be on screen before it plays. */
const MIN_RATIO = 0.4;
/** Tall elements can never reach that share, so a fixed slice of the viewport also counts. */
const MIN_VIEWPORT_SHARE = 0.35;
/** If something sits partly on screen this long without qualifying, show it anyway. */
const GRACE_MS = 2500;

const pending = new WeakMap<Element, number>();

function show(el: Element) {
  const timer = pending.get(el);
  if (timer) window.clearTimeout(timer);
  pending.delete(el);
  el.classList.add("is-visible");
  observer?.unobserve(el);
}

function qualifies(entry: IntersectionObserverEntry) {
  return (
    entry.intersectionRatio >= MIN_RATIO ||
    entry.intersectionRect.height >= window.innerHeight * MIN_VIEWPORT_SHARE
  );
}

function getObserver() {
  if (observer || typeof IntersectionObserver === "undefined") return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target;
        if (!entry.isIntersecting) {
          // Scrolled back out before qualifying: cancel the grace timer, try again later.
          const timer = pending.get(el);
          if (timer) window.clearTimeout(timer);
          pending.delete(el);
          continue;
        }
        if (qualifies(entry)) {
          show(el);
          continue;
        }
        // Partly on screen. Give it a moment to come further in; otherwise show it so
        // nothing is ever stuck invisible.
        if (!pending.has(el)) {
          pending.set(el, window.setTimeout(() => show(el), GRACE_MS));
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] }
  );
  return observer;
}

/**
 * Entrances. Each section uses a different one so the page doesn't feel like the same
 * fade forty times. `blur` is for text only: it leaves a filter on the element, which
 * would make a screenshot inside it re-rasterise.
 */
export type RevealFrom = "up" | "down" | "left" | "right" | "scale" | "rise" | "blur";

function startTransform(from: RevealFrom, y: number) {
  switch (from) {
    case "down":
      return `translateY(${-y}px)`;
    case "left":
      return `translateX(${-Math.round(y * 1.4)}px)`;
    case "right":
      return `translateX(${Math.round(y * 1.4)}px)`;
    case "scale":
      return `scale(0.94) translateY(${Math.round(y / 2)}px)`;
    case "rise":
      return `translateY(${Math.round(y * 1.6)}px) scale(0.98)`;
    case "blur":
      return `translateY(${Math.round(y / 2)}px)`;
    default:
      return `translateY(${y}px)`;
  }
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Which way the element arrives from. */
  from?: RevealFrom;
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
  from = "up",
  style,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Anything already on screen at mount animates straight away, so the hero plays
    // its entrance on load instead of waiting for a scroll that may never come.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) {
      el.classList.add("is-visible");
      return;
    }

    const io = getObserver();
    if (!io) {
      el.classList.add("is-visible");
      return;
    }
    io.observe(el);

    return () => {
      const timer = pending.get(el);
      if (timer) window.clearTimeout(timer);
      pending.delete(el);
      io.unobserve(el);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      data-blur={from === "blur" ? "" : undefined}
      style={
        {
          "--reveal-delay": `${delay}ms`,
          "--reveal-duration": `${duration}ms`,
          "--reveal-from": startTransform(from, y),
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
