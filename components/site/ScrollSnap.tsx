"use client";

import { useEffect } from "react";

/**
 * Page-by-page scrolling on a computer, going down: every section is one screen, and one wheel or
 * trackpad gesture (or Page Down, Space, the down arrow) moves one page down with an eased glide.
 * The glide starts at the speed of your hand and slows into the page, so it answers on the first
 * frame and lands softly. The rest of that gesture, including trackpad momentum, is absorbed, so one
 * flick is one page; a second, separate flick (or key press) carries straight on to the next page
 * without waiting for the first glide to finish.
 *
 * Going up is never held or snapped: the page scrolls freely and stops wherever you stop, and
 * scrolling up stops a glide that's still running. The next gesture down goes to the next page top
 * below (a page you can see almost all of counts as the one you're on).
 *
 * A section taller than the screen (on a short screen) takes more than one move: about a screen at a
 * time, the last one bringing its bottom edge into view, then on to the next section. A downward
 * scroll the browser drives itself (a gesture that started sideways, the scrollbar) settles onto a
 * page when it stops. Find in page, links to sections and keyboard focus are left where the browser
 * puts them. Phones scroll normally; off for reduced motion (both re-checked live); keys typed into a
 * form field or a widget are left alone.
 *
 * Why the first wheel event matters: Chrome and Safari only let a page cancel the rest of a gesture
 * if it cancelled the gesture's first event. So a gesture down is either ours from its first event
 * (every event cancelled, the page moved only by the glide) or the browser's from start to finish
 * (never fought; settled once it stops).
 */

// ── Feel ─────────────────────────────────────────────────────────────────────────────────────────
// A glide lasts DUR_BASE + DUR_PER_PX × distance, between DUR_MIN and DUR_MAX (a full 900px page:
// about 600ms, with 85% or more of the way covered in the first 70% of the time and the rest spent
// slowing into the page).
const DUR_BASE = 220;
const DUR_PER_PX = 0.42;
const DUR_MIN = 280;
const DUR_MAX = 620;
const DUR_FAST = 360; // a hard flick can shorten a glide, down to this
// Start speed, as a multiple of the glide's average speed. 0 would start from rest (ease-in-out,
// which reads as lag after a flick), 2 is ease-out-quad, 3 is ease-out-cubic (the most a cubic can
// take without overshooting the page).
const START_WHEEL = 1.2; // at least this for wheel and trackpad, even for a slow hand
const START_KEY = 2; // Page Down, Space, the down arrow
const START_SETTLE = 0.6; // settling a page the browser scrolled (it's at rest)
const START_MAX = 3;
const HAND_MAX = 8; // px/ms; faster readings are noise

// ── Gestures ─────────────────────────────────────────────────────────────────────────────────────
const START_PX = 2; // a gesture down moves a page once it has gone this far
const RETOUCH_PX = 12; // touching the trackpad to stop momentum isn't a new flick until this far
const ADVANCE = 0.15; // a move down goes to the first page top more than 15% of a screen below
// A pause this long ends a gesture. Where the browser can't say which events are momentum (Safari,
// Firefox), the pause between a Mac trackpad flick and its momentum must not count, hence 320ms.
// Chrome and Edge 151+ flag momentum (WheelEvent.momentum), and mice have none (Firefox reports a
// wheel mouse in lines), so there a short pause is enough to start a new gesture.
const GAP = 320;
const GAP_KNOWN = 140;
const CHAIN_MS = 180; // after a page move, the next one waits at least this long
const BOOST_MS = 120; // for this long after a move starts, a faster hand speeds the glide up
// Without momentum flags, a second flick shows up as speed rising again after it had fallen.
const RISE = 1.8; // × the lowest speed since it started falling
const RISE_FLOOR = 0.45; // px/ms
const UP_PX = 4; // an upward event this big lets go; smaller ones are the jitter at the end of a flick
const TALL_SLACK = 120; // a page up to this much taller than the screen still counts as one page
const STEP = 0.85; // through a taller page, a screen at a time less a little overlap
const SETTLE_MS = 160; // quiet time after a browser-driven scroll down before it settles
const LINE_PX = 100 / 6; // deltaMode 1 (lines) to pixels

// Widgets that use Space or the arrow keys themselves.
const WIDGETS =
  '[role="button"],[role="tab"],[role="slider"],[role="spinbutton"],[role="listbox"],[role="option"],' +
  '[role="menu"],[role="menuitem"],[role="radiogroup"],[role="radio"],[role="combobox"],[role="textbox"],[role="grid"],[role="tree"]';

type Page = { top: number; bottom: number; tall: boolean };
type Glide = { from: number; to: number; dur: number; v: number; t0: number };

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
// A cubic from 0 to 1 that leaves at slope v and arrives at rest (v = 0 is smoothstep, v = 2 is
// ease-out-quad, v = 3 is ease-out-cubic), and its slope, so a glide can be retargeted mid-flight
// keeping the speed it has.
const ease = (t: number, v: number) => t * (v + t * (3 - 2 * v + t * (v - 2)));
const slope = (t: number, v: number) => v + t * (6 - 4 * v + t * (3 * v - 6));

export default function ScrollSnap() {
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 761px) and (hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    let off: (() => void) | null = null;
    const sync = () => {
      const on = wide.matches && !calm.matches;
      if (on && !off) off = paging();
      else if (!on && off) {
        off();
        off = null;
      }
    };
    wide.addEventListener("change", sync);
    calm.addEventListener("change", sync);
    sync();
    return () => {
      wide.removeEventListener("change", sync);
      calm.removeEventListener("change", sync);
      off?.();
      off = null;
    };
  }, []);
  return null;
}

function paging(): () => void {
  const html = document.documentElement;

  let glide: Glide | null = null;
  let raf = 0;
  let frameAt = 0; // timestamp of the last frame drawn
  let frameDt = 1000 / 60; // measured frame interval (60, 120, 144Hz...)
  let y = window.scrollY; // where the last frame put the page

  let lastAt = -Infinity; // last wheel event
  let owned = false; // this gesture down is ours: its first event was cancelled
  let pending = false; // ...and it hasn't moved a page yet
  let need = START_PX;
  let acc = 0;
  let movedAt = -Infinity;
  let movedInGesture = false;
  let sawMomentum = false;
  let speed = 0; // the hand's speed, px/ms, smoothed
  let peak = 0;
  let trough = Infinity;
  let falling = false;
  let rising = 0;

  let nativeDown = false; // the browser is scrolling down on its own; settle when it stops
  let dragFrom = -1; // scrollY when the scrollbar was grabbed, or -1
  let settleTimer = 0;

  const maxY = () => html.scrollHeight - window.innerHeight;
  const pages = (): Page[] => {
    const secs = Array.from(document.querySelectorAll<HTMLElement>(".cr-site main > section")).filter((s) => s.offsetHeight > 0);
    const vh = window.innerHeight;
    return secs.map((s, i) => {
      const r = s.getBoundingClientRect();
      const top = Math.max(0, Math.round(r.top + window.scrollY));
      // The last page runs to the end of the document, so it takes the footer in; whether a page is
      // "tall" goes by the section alone, so the short footer never adds a stop.
      const bottom = i === secs.length - 1 ? html.scrollHeight : Math.round(r.bottom + window.scrollY);
      return { top, bottom, tall: r.height > vh + TALL_SLACK };
    });
  };
  const indexAt = (ps: Page[], at: number) => {
    let i = 0;
    ps.forEach((p, k) => {
      if (p.top <= at + 2) i = k;
    });
    return i;
  };

  // Where moves down can stop: every page top; inside a page taller than the screen, about a screen
  // at a time and then its bottom edge in view; and the end of the document (the last page runs on
  // to the footer).
  const stops = (): number[] => {
    const vh = window.innerHeight;
    const end = maxY();
    const ps = pages();
    const out: number[] = [];
    ps.forEach((p, i) => {
      out.push(p.top);
      if (!p.tall || i === ps.length - 1) return;
      const edge = p.bottom - vh;
      for (let s = p.top + Math.round(vh * STEP); s < edge - TALL_SLACK; s += Math.round(vh * STEP)) out.push(s);
      out.push(edge);
    });
    out.push(end);
    return out.map((s) => Math.min(s, end));
  };
  // Where a move down from `from` goes: the first stop more than ADVANCE of a screen below (a page
  // you can see almost all of counts as the one you're on), or the next stop after a glide's target
  // when chaining onto it. null: there's nowhere further to go.
  const plan = (from: number, chained: boolean): number | null => {
    const min = from + (chained ? 2 : ADVANCE * window.innerHeight);
    const to = stops().find((s) => s > min) ?? maxY();
    return to - from >= 1 ? to : null;
  };

  // ── The glide ──────────────────────────────────────────────────────────────────────────────────
  const stop = () => {
    glide = null;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };
  const progress = () => (glide && !Number.isNaN(glide.t0) ? clamp((frameAt - glide.t0) / glide.dur, 0, 1) : 0);
  const velocity = () => (glide && !Number.isNaN(glide.t0) ? ((glide.to - glide.from) * slope(progress(), glide.v)) / glide.dur : 0);

  const frame = (now: number) => {
    raf = 0;
    const dt = now - frameAt;
    if (dt > 4 && dt < 50) frameDt += (dt - frameDt) * 0.2;
    frameAt = now;
    const g = glide;
    if (!g) return;
    // Timed from the frame clock, never from the event's clock (a frame's timestamp can be earlier
    // than the event that started the glide), and the first frame already shows one frame of motion.
    if (Number.isNaN(g.t0)) g.t0 = now - frameDt;
    const t = clamp((now - g.t0) / g.dur, 0, 1);
    y = t < 1 ? g.from + (g.to - g.from) * ease(t, g.v) : g.to;
    // "instant" overrides html { scroll-behavior: smooth } without touching the stylesheet.
    window.scrollTo({ top: y, behavior: "instant" });
    if (t < 1) raf = requestAnimationFrame(frame);
    else glide = null;
  };

  // Glide to `target`, leaving at whichever is fastest: the speed the page already has, the hand's
  // speed (px/ms), or startMin × the glide's average speed. A running glide is retargeted from where
  // it is, so the motion never jumps or stalls. Returns false if it's already there.
  const glideTo = (target: number, hand: number, startMin: number): boolean => {
    const to = Math.round(clamp(target, 0, maxY()));
    const running = !!glide && !Number.isNaN(glide.t0);
    const from = running ? y : window.scrollY;
    const dist = Math.abs(to - from);
    if (dist < 1) {
      if (glide) stop();
      return false;
    }
    const carry = Math.max(0, velocity() * Math.sign(to - from));
    const v = Math.max(carry, Math.min(HAND_MAX, hand));
    let dur = clamp(DUR_BASE + DUR_PER_PX * dist, DUR_MIN, DUR_MAX);
    // A hand faster than the curve can leave at shortens the glide instead (never below DUR_FAST).
    if (v > 0 && (START_MAX * dist) / v < dur) dur = Math.max((START_MAX * dist) / v, Math.min(dur, DUR_FAST));
    glide = { from, to, dur, v: clamp(Math.max((v * dur) / dist, startMin), 0, START_MAX), t0: running ? frameAt : Number.NaN };
    y = from;
    if (!raf) raf = requestAnimationFrame(frame);
    return true;
  };

  // ── Input ──────────────────────────────────────────────────────────────────────────────────────
  const release = () => {
    stop();
    owned = false;
    pending = false;
    nativeDown = false;
    window.clearTimeout(settleTimer);
  };

  const settleSoon = () => {
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(settle, SETTLE_MS);
  };
  // After a downward scroll the browser drove itself (its momentum may already have carried it a
  // page or two): onto the nearer of the stops either side, the smallest move. On the last page (it
  // runs on to the footer) it stays.
  const settle = () => {
    if (dragFrom >= 0 || glide || !nativeDown) return;
    nativeDown = false;
    const at = window.scrollY;
    const ps = pages();
    if (!ps.length || indexAt(ps, at) === ps.length - 1) return;
    let above = 0;
    let below = -1;
    for (const s of stops()) {
      if (s <= at + 2) above = s;
      else if (below < 0) below = s;
    }
    if (below < 0 || at - above < 3) return;
    glideTo(at - above < below - at ? above : below, 0, START_SETTLE);
  };

  const onWheel = (e: WheelEvent) => {
    if (e.ctrlKey || e.defaultPrevented) return; // pinch zoom, or handled by something else
    const unit = e.deltaMode === 1 ? LINE_PX : e.deltaMode === 2 ? window.innerHeight : 1;
    const dy = e.deltaY * unit;
    const dx = e.deltaX * unit;
    const clock = performance.now();
    const now = Math.abs(e.timeStamp - clock) < 1000 ? e.timeStamp : clock;
    const gap = now - lastAt;
    lastAt = now;

    // Is this the start of a new gesture, or more of the last one?
    const known = "momentum" in e;
    const momentum = known && (e as WheelEvent & { momentum: boolean }).momentum;
    let fresh = false;
    let retouch = false;
    if (momentum) sawMomentum = true;
    else {
      retouch = sawMomentum; // fingers back on the trackpad after momentum
      sawMomentum = false;
      fresh = retouch || gap > (known || e.deltaMode === 1 ? GAP_KNOWN : GAP);
    }
    if (fresh) {
      owned = false;
      pending = false;
      movedInGesture = false;
      acc = 0;
      need = retouch ? RETOUCH_PX : START_PX;
      peak = 0;
      trough = Infinity;
      falling = false;
      rising = 0;
    }

    // Sideways: back/forward swipes stay the browser's. A gesture down may start a little diagonal
    // (its first event decides who owns it), so only a clearly sideways one is left alone; inside a
    // gesture that's ours, a sideways wobble is held still like the rest.
    if (owned ? Math.abs(dy) <= Math.abs(dx) : dy <= 0 ? Math.abs(dy) <= Math.abs(dx) : 2 * dy < Math.abs(dx)) {
      if (owned && e.cancelable) e.preventDefault();
      return;
    }
    if (dy < 0) {
      if (owned && -dy < UP_PX && e.cancelable) e.preventDefault(); // the jitter at the end of a flick
      else release(); // going up is always free
      return;
    }
    if (!e.cancelable) {
      // The browser took this gesture (its first event wasn't cancelled): never fight it.
      if (glide) stop();
      owned = false;
      nativeDown = true;
      settleSoon();
      return;
    }
    if (!owned) {
      // Only ever from a gesture's first event, and not at the very end (nothing below; the browser
      // can do its bounce) unless a glide is running, which the gesture then chains onto.
      if (!fresh || (!glide && plan(window.scrollY, false) === null)) {
        nativeDown = true;
        settleSoon();
        return;
      }
      owned = true;
      pending = true;
    }
    e.preventDefault();

    const v = dy / (fresh ? 16 : clamp(gap, 4, 50));
    speed = fresh ? v : speed + (v - speed) * 0.5;
    acc += dy;

    if (!known && movedInGesture && !pending) {
      if (!falling) {
        peak = Math.max(peak, speed);
        if (speed < peak * 0.7) falling = true;
      } else {
        trough = Math.min(trough, speed);
        rising = speed > Math.max(trough * RISE, RISE_FLOOR) ? rising + 1 : 0;
        if (rising >= 2) {
          pending = true; // a second flick
          need = 0;
        }
      }
    }

    if (pending && acc >= need && now - movedAt >= CHAIN_MS) {
      pending = false;
      const target = plan(glide ? glide.to : window.scrollY, !!glide);
      if (target !== null && glideTo(target, speed, START_WHEEL)) {
        movedAt = now;
        movedInGesture = true;
        peak = speed;
        trough = Infinity;
        falling = false;
        rising = 0;
      }
      return;
    }
    // Just after a move starts, a hand still speeding up pushes the glide along.
    if (glide && !momentum && movedInGesture && now - movedAt < BOOST_MS && speed > velocity() * 1.15) {
      glideTo(glide.to, speed, START_WHEEL);
    }
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target as HTMLElement | null;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON|VIDEO|AUDIO)$/.test(t.tagName) || t.closest?.(WIDGETS))) return;
    if (e.key === "PageUp" || e.key === "ArrowUp" || e.key === "Home" || e.key === "End" || (e.key === " " && e.shiftKey)) {
      release(); // these scroll the way the browser does
      return;
    }
    if (!(e.key === "PageDown" || e.key === "ArrowDown" || e.key === " ")) return;
    if (e.repeat && glide && progress() < 0.6) {
      e.preventDefault(); // a key held down: the next page once this one is mostly there
      return;
    }
    const target = plan(glide ? glide.to : window.scrollY, !!glide);
    if (target === null) {
      if (glide) e.preventDefault();
      return; // at the end: the browser's own scrolling
    }
    e.preventDefault();
    glideTo(target, 0, START_KEY);
  };

  // Only scrolls we can tell came from the user's hand settle: never find-in-page, links or focus.
  const onScroll = () => {
    if (!glide && (nativeDown || dragFrom >= 0)) settleSoon();
  };
  const onPointerDown = (e: PointerEvent) => {
    // A press on the page's own scrollbar (Chrome and Firefox aim it at <html>). Mac overlay
    // scrollbars may not report it; then the page simply stays where it's dragged.
    if (e.target === html && e.clientX >= html.clientWidth) {
      release();
      dragFrom = window.scrollY;
    } else dragFrom = -1;
  };
  const onPointerUp = () => {
    if (dragFrom < 0) return;
    if (window.scrollY > dragFrom + 2) {
      nativeDown = true;
      settleSoon();
    }
    dragFrom = -1;
  };

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", onKey);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);
  window.addEventListener("resize", release);
  return () => {
    release();
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerUp);
    window.removeEventListener("resize", release);
  };
}
