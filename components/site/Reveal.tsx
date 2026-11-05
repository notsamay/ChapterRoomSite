"use client";

import { useEffect } from "react";

/**
 * Fades sections up as they scroll into view. Marks the page with `.cr-js` first, so
 * anything tagged `data-reveal` stays visible if this never runs.
 */
export default function Reveal() {
  useEffect(() => {
    const root = document.querySelector(".cr-site");
    if (!root) return;
    root.classList.add("cr-js");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
