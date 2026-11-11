import { CAMPUSES, GRID_HEAT, SCHOOLS } from "./map-data";
import MapPicker from "./MapPicker";
import WaitingRoom from "./WaitingRoom";
import Title from "./Title";

const CREAM = "#F6F2E9";
const DEEP = "#123A2E";
const widthFor = (label: string, sub: string) => Math.max(label.length * 7 + 28, sub.length * 5.7 + 28);

// School dots are shaded like the grid: darker where schools cluster, lighter where they stand alone.
const SCHOOL_SHADE = (() => {
  const sigma = 48;
  const d = SCHOOLS.map((a) =>
    SCHOOLS.reduce((sum, b) => sum + Math.exp(-((a.x - b.x) ** 2 + (a.y - b.y) ** 2) / (2 * sigma * sigma)), 0)
  );
  const max = Math.max(...d);
  return d.map((v) => +(0.28 + 0.5 * Math.min(1, (v - 1) / (max - 1 || 1)) ** 0.7).toFixed(3));
})();

/** A two-line emerald label pinned to a dot: always shown for the launch campuses, on hover for the rest.
 *  `caret` points it down at the dot. */
function Tip({ label, sub, x, y, w, caret, on }: { label: string; sub: string; x: number; y: number; w: number; caret?: number; on?: boolean }) {
  return (
    <g className={on ? "tip on" : "tip"} aria-hidden="true">
      <rect x={x} y={y} width={w} height={40} rx={10} fill={DEEP} />
      {caret !== undefined && <path d={`M${caret - 6} ${y + 40}h12l-6 6z`} fill={DEEP} />}
      <text x={x + w / 2} y={y + 17} textAnchor="middle" fill={CREAM}>
        {label}
      </text>
      <text className="tip-sub" x={x + w / 2} y={y + 31} textAnchor="middle" fill={CREAM}>
        {sub}
      </text>
    </g>
  );
}

/** A graphic on a cream panel: the US as a fine emerald dot grid, schools as darker dots, and the three launch
 *  campuses as sage pins with their labels always showing. The grid darkens where the schools are. */
function LaunchMap() {
  return (
    <MapPicker>
      <svg
        className="cr-map"
        viewBox="0 0 960 600"
        role="group"
        aria-label="Dot map of the United States: small dark dots mark schools, and labelled green pins mark the launch campuses, UW–Madison, the University of South Carolina and Clemson. Choose a school to add it to the waiting room."
      >
        <defs>
          {/* The launch pins: a soft sage glow, and a core that runs from sage to emerald. */}
          <radialGradient id="cr-pin-glow">
            <stop offset="0" stopColor="#7FA884" stopOpacity="0.55" />
            <stop offset="1" stopColor="#7FA884" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cr-pin-core" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7FA884" />
            <stop offset="1" stopColor="#123A2E" />
          </linearGradient>
        </defs>
        {/* The dot grid, darker where the schools are and fading out where there are none. */}
        {GRID_HEAT.map(([o, d]) => (
          <path key={o} d={d} fill="none" stroke={DEEP} strokeOpacity={o} strokeWidth={4.4} strokeLinecap="round" style={{ pointerEvents: "none" }} />
        ))}
        {SCHOOLS.map((s, i) => {
          const sub = "Click to join the waiting room";
          const w = widthFor(s.name, sub);
          const x = Math.min(Math.max(s.x - w / 2, 4), 956 - w);
          return (
            <g key={s.label} className="cp" data-school={s.name} tabIndex={0} role="button" aria-label={`${s.name}: add to the waiting room`}>
              <circle className="hit" cx={s.x} cy={s.y} r={11} />
              <circle className="ring" cx={s.x} cy={s.y} r={9} />
              <circle className="sd" cx={s.x} cy={s.y} r={3.1} fill={DEEP} fillOpacity={SCHOOL_SHADE[i]} />
              <Tip label={s.name} sub={sub} x={x} y={s.y - 56} w={w} caret={s.x} />
            </g>
          );
        })}
        {CAMPUSES.map((c) => {
          const sub = "Spring 2027";
          const w = widthFor(c.label, sub);
          // Above the dot, to its left, or (for the right-hand one, which would run off the edge) just below it.
          const x = c.side === 0 ? c.x - w / 2 : c.side < 0 ? c.x - w - 18 : Math.min(c.x - w / 2 + 40, 956 - w);
          const y = c.side === 0 ? c.y - 60 : c.side < 0 ? c.y - 20 : c.y + 20;
          return (
            <g key={c.label} className="cp" data-school={c.name} tabIndex={0} role="button" aria-label={`${c.name}, launching spring 2027: add to the waiting room`}>
              <circle className="hit" cx={c.x} cy={c.y} r={14} />
              <circle className="ring" cx={c.x} cy={c.y} r={13} />
              <circle cx={c.x} cy={c.y} r={24} fill="url(#cr-pin-glow)" style={{ pointerEvents: "none" }} />
              <circle className="cd" cx={c.x} cy={c.y} r={7.5} fill="url(#cr-pin-core)" stroke="#F6F2E9" strokeWidth={2.5} />
              <Tip label={c.label} sub={sub} x={x} y={y} w={w} on />
            </g>
          );
        })}
      </svg>
    </MapPicker>
  );
}

export default function Launch() {
  return (
    <section id="launch" className="cr-launch cr-g-emerald cr-on-dark">
      <div className="cr-launch-in">
        {/* One graphic: a cream panel holding the headline, the waiting room and the map. */}
        <div className="cr-launch-gfx">
          <div className="cr-head cr-launch-head" data-reveal>
            <Title text="where we’re / launching." />
            <p className="cr-sub">Spring 2027, starting at UW–Madison, the University of South Carolina and Clemson.</p>
          </div>
          <div className="cr-launch-map">
            <LaunchMap />
            <p className="cr-map-hint">Click any school to add it to the waiting room.</p>
          </div>
          <WaitingRoom />
        </div>
      </div>
    </section>
  );
}
