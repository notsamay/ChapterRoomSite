"use client";

import { useEffect, useRef } from "react";

/**
 * A soft pool of light that follows the pointer across its parent. Purely decorative: it
 * fades in on the first move, tracks on animation frames, and stays off for touch devices
 * and reduced-motion users. The parent must be `position: relative`.
 */
export default function Spotlight({ color = "rgba(143, 191, 152, 0.16)" }: { color?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }

    let frame = 0;
    const onMove = (event: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--sx", `${x}px`);
        el.style.setProperty("--sy", `${y}px`);
        el.style.opacity = "1";
      });
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };

    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700"
      style={{
        background: `radial-gradient(560px circle at var(--sx, 50%) var(--sy, 40%), ${color}, transparent 62%)`,
      }}
    />
  );
}
