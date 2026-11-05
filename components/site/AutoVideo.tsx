"use client";

import { useEffect, useRef } from "react";
import type { Clip } from "./media";

/**
 * A muted, looping recording that only plays while it is on screen.
 * With `restartKey`, it starts again from the top whenever the key changes
 * (used by the showcase tabs and the timeline).
 */
export default function AutoVideo({
  clip,
  alt,
  className,
  loop = true,
  playing = true,
  restartKey,
}: {
  clip: Clip;
  alt: string;
  className?: string;
  loop?: boolean;
  playing?: boolean;
  restartKey?: number | string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const visible = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        if (entry.isIntersecting && playing) video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "200px" }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [playing]);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (!playing) {
      video.pause();
      try {
        video.currentTime = 0;
      } catch {}
      return;
    }
    try {
      video.currentTime = 0;
    } catch {}
    if (visible.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) video.play().catch(() => {});
  }, [restartKey, playing]);

  return (
    <video
      ref={ref}
      src={clip.src}
      poster={clip.poster}
      muted
      loop={loop}
      playsInline
      preload="metadata"
      aria-label={alt}
      className={className}
    />
  );
}
