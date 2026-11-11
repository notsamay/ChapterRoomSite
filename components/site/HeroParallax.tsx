"use client";

import { useEffect } from "react";

/**
 * The hero's card wall, client side:
 *  - parallax: scrolling moves each column at a different speed. Writes one CSS variable on the
 *    hero (--sy, the scroll in px); the stylesheet does the rest. Off for reduced motion.
 *  - card links: each card jumps to the section that shows it. Phones leave some sections out
 *    (Chats and feeds, Events, Money); a card for one of those goes to Features instead.
 */
export default function HeroParallax() {
  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;
    const onClick = (e: MouseEvent) => {
      const card = (e.target as Element).closest?.(".cr-hero-card");
      const id = card?.getAttribute("href")?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (card && (!target || target.offsetParent === null)) {
        e.preventDefault();
        document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
      }
    };
    hero.addEventListener("click", onClick);
    return () => hero.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const sy = Math.min(Math.max(window.scrollY, 0), hero.offsetHeight);
      hero.style.setProperty("--sy", `${sy.toFixed(1)}px`);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
