"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  BORDERS_PATH,
  COLONY_PINS,
  COLONY_STATE_IDS,
  MAP_ASPECT,
  MAP_VIEWBOX,
  NATION_PATH,
  STATES,
  type ColonyPin,
  type MapState,
} from "./colony-map-data";

/**
 * The colony map, pre-projected at build time (see scripts/generate-colony-map.mjs).
 *
 * Geometry is SVG so it scales cleanly; pins, labels and the tooltip are an HTML overlay
 * positioned in percentages of the viewBox, so type stays readable at every size.
 *
 * Every state is live: hover or focus shows what is there, a tap pins the card open
 * (touch has no hover), and states without a colony point straight at the waitlist.
 */

const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado",
  CT: "Connecticut", DE: "Delaware", DC: "District of Columbia", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky",
  LA: "Louisiana", ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota",
  MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire",
  NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota",
  OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island",
  SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

/** Pins grouped by the FIPS id of the state they sit in. */
const pinsByState = new Map<string, ColonyPin[]>();
/** The reverse lookup, so a pin can light up its state. */
const stateByPin = new Map<ColonyPin, string>();
for (const pin of COLONY_PINS) {
  const state = STATES.find((s) => s.name === STATE_NAMES[pin.city.slice(-2)]);
  if (!state) continue;
  pinsByState.set(state.id, [...(pinsByState.get(state.id) ?? []), pin]);
  stateByPin.set(pin, state.id);
}

const COLONY_STATES = STATES.filter((s) => COLONY_STATE_IDS.includes(s.id));

export default function ColonyMap({ className = "" }: { className?: string }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const activeId = pinned ?? hovered;
  const active = activeId ? STATES.find((s) => s.id === activeId) ?? null : null;

  // A pinned card closes on Escape, or on a tap anywhere outside the map.
  useEffect(() => {
    if (!pinned) return;
    const onKey = (event: globalThis.KeyboardEvent) => event.key === "Escape" && setPinned(null);
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setPinned(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [pinned]);

  const toggle = (id: string) => setPinned((current) => (current === id ? null : id));
  const onKeyDown = (event: KeyboardEvent, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle(id);
    }
  };

  return (
    <div ref={rootRef} className={`mx-auto w-full ${className}`}>
      <div className="relative w-full" style={{ aspectRatio: MAP_ASPECT }}>
        <svg
          viewBox={MAP_VIEWBOX}
          className="h-full w-full overflow-visible outline-none"
          role="group"
          aria-label="Map of colony schools"
        >
          {/* Land, one state at a time so each can light up on its own. */}
          <g>
            {STATES.map((state) => {
              const isColony = COLONY_STATE_IDS.includes(state.id);
              const isActive = state.id === activeId;
              return (
                <path
                  key={state.id}
                  d={state.d}
                  tabIndex={0}
                  role="button"
                  aria-label={describe(state)}
                  aria-pressed={pinned === state.id}
                  className="map-state cursor-pointer transition-[fill] duration-200"
                  fill={
                    isColony
                      ? isActive
                        ? "rgba(96,148,104,0.95)"
                        : "rgba(78,122,84,0.85)"
                      : isActive
                        ? "rgba(246,242,233,0.16)"
                        : "rgba(246,242,233,0.05)"
                  }
                  onMouseEnter={() => setHovered(state.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(state.id)}
                  onBlur={() => setHovered(null)}
                  onClick={() => toggle(state.id)}
                  onKeyDown={(event) => onKeyDown(event, state.id)}
                />
              );
            })}
          </g>
          <path
            d={BORDERS_PATH}
            fill="none"
            stroke="rgba(246,242,233,0.2)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            className="pointer-events-none"
          />
          {/* Colony outlines sit above the borders so the stroke reads at full strength. */}
          {COLONY_STATES.map((state) => (
            <path
              key={`edge-${state.id}`}
              d={state.d}
              fill="none"
              stroke="#F6F2E9"
              strokeWidth={state.id === activeId ? 2 : 1.5}
              vectorEffect="non-scaling-stroke"
              className="pointer-events-none transition-[stroke-width] duration-200"
            />
          ))}
          {active && !COLONY_STATE_IDS.includes(active.id) && (
            <path
              d={active.d}
              fill="none"
              stroke="rgba(246,242,233,0.7)"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
              className="pointer-events-none"
            />
          )}
          <path
            d={NATION_PATH}
            fill="none"
            stroke="rgba(246,242,233,0.5)"
            strokeWidth={1.6}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="pointer-events-none"
          />
        </svg>

        {/* Pins and their leader labels. */}
        <div className="pointer-events-none absolute inset-0">
          {COLONY_PINS.map((pin) => {
            const stateId = stateByPin.get(pin);
            const lit = stateId != null && stateId === activeId;
            return (
              <div key={pin.city} className="absolute" style={{ left: `${pin.left}%`, top: `${pin.top}%` }}>
                <button
                  type="button"
                  aria-label={`${pin.school}, ${pin.city}`}
                  onClick={() => stateId && toggle(stateId)}
                  onMouseEnter={() => stateId && setHovered(stateId)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => stateId && setHovered(stateId)}
                  onBlur={() => setHovered(null)}
                  className="map-pin pointer-events-auto absolute left-0 top-0 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-cream/70"
                >
                  <span
                    className={`absolute inset-0 rounded-full bg-cream/30 transition-transform duration-200 ${
                      lit ? "scale-125" : "animate-pulse-soft"
                    }`}
                  />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-cream" />
                </button>
                {/* Below md the map is too narrow for a leader line to reach clear space,
                    so the names drop to the caption instead of running off the edge. */}
                <div
                  aria-hidden="true"
                  className={`absolute top-0 hidden -translate-y-1/2 items-center gap-2 md:flex ${
                    pin.side === "right" ? "left-[13px]" : "right-[13px] flex-row-reverse"
                  }`}
                >
                  <span className="h-px w-[19px] shrink-0 bg-cream/50" />
                  <span
                    className={`whitespace-nowrap text-[clamp(9px,1.05vw,11px)] font-semibold uppercase tracking-[0.14em] transition-colors ${
                      lit ? "text-cream" : "text-cream/85"
                    }`}
                  >
                    {pin.city}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {active && <Tooltip state={active} pinned={pinned === active.id} onClose={() => setPinned(null)} />}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cream/55">
        <ul className="contents md:hidden">
          {COLONY_PINS.map((pin) => (
            <li key={pin.city} className="flex items-center gap-2 text-cream/80">
              <span className="h-2 w-2 rounded-full bg-cream md:hidden" aria-hidden="true" />
              {pin.city}
            </li>
          ))}
        </ul>
        <span className="hidden md:inline">Hover a state to see what&rsquo;s there</span>
        <span className="md:hidden">Tap a state to see what&rsquo;s there</span>
      </div>
    </div>
  );
}

function Tooltip({ state, pinned, onClose }: { state: MapState; pinned: boolean; onClose: () => void }) {
  const pins = pinsByState.get(state.id) ?? [];
  const isColony = pins.length > 0;
  // Keep the card on the map near the edges instead of centring it off-screen.
  const anchor = state.left > 82 ? 92 : state.left < 14 ? 8 : 50;
  // Cards sit above the state, except near the top where they would leave the map.
  const above = state.top > 26;
  const surface = isColony ? "border-sage/40 bg-pine-deep/95" : "border-cream/15 bg-ink/90";

  return (
    <div
      role="status"
      className="pointer-events-none absolute z-10 w-max max-w-[260px]"
      style={{
        left: `${state.left}%`,
        top: `${state.top}%`,
        transform: above ? `translate(-${anchor}%, calc(-100% - 16px))` : `translate(-${anchor}%, 18px)`,
      }}
    >
      <div className={`rounded-[18px] border px-4 py-3.5 text-left shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-[12px] ${surface}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="text-[15px] font-semibold leading-tight text-cream">{state.name}</div>
          {pinned && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="pointer-events-auto -mr-1.5 -mt-1 flex h-6 w-6 items-center justify-center rounded-full text-cream/55 hover:bg-cream/10 hover:text-cream"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {isColony ? (
          <ul className="mt-2 space-y-1.5">
            {pins.map((pin) => (
              <li key={pin.city} className="flex items-start gap-2 text-[13px] leading-snug">
                <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-sage" aria-hidden="true" />
                <span>
                  <span className="text-cream">{pin.school}</span>
                  <span className="block text-[11.5px] text-cream/50">Colony · {pin.city} · Spring 2027</span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <p className="mt-1 text-[13px] leading-snug text-cream/60">No colony here yet.</p>
            <a
              href="#waitlist"
              onClick={onClose}
              className="pointer-events-auto mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-sage hover:text-cream"
            >
              Put your school on the map
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </a>
          </>
        )}
      </div>
      {/* The little arrow, pointing at the state. */}
      <span
        aria-hidden="true"
        className={`absolute h-3 w-3 -translate-x-1/2 rotate-45 border ${surface} ${
          above ? "-bottom-1.5 border-l-0 border-t-0" : "-top-1.5 border-b-0 border-r-0"
        }`}
        style={{ left: `${anchor}%` }}
      />
    </div>
  );
}

function describe(state: MapState) {
  const pins = pinsByState.get(state.id) ?? [];
  return pins.length > 0
    ? `${state.name}: ${pins.map((p) => p.school).join(" and ")}`
    : `${state.name}: no colony yet`;
}
