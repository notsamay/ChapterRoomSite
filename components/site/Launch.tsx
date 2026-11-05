import { CAMPUSES, GRID_DOTS, SCHOOLS } from "./map-data";
import MapPicker from "./MapPicker";
import WaitingRoom from "./WaitingRoom";

const CREAM = "#F6F2E9";
const DEEP = "#123A2E";
const widthFor = (label: string, sub: string) => Math.max(label.length * 7 + 28, sub.length * 5.7 + 28);

/** The two-line label that rises over a dot on hover. `caret` points it down at the dot. */
function Tip({ label, sub, x, y, w, caret }: { label: string; sub: string; x: number; y: number; w: number; caret?: number }) {
  return (
    <g className="tip" aria-hidden="true">
      <rect x={x} y={y} width={w} height={40} rx={10} fill={CREAM} />
      {caret !== undefined && <path d={`M${caret - 6} ${y + 40}h12l-6 6z`} fill={CREAM} />}
      <text x={x + w / 2} y={y + 17} textAnchor="middle" fill={DEEP}>
        {label}
      </text>
      <text className="tip-sub" x={x + w / 2} y={y + 31} textAnchor="middle" fill={DEEP}>
        {sub}
      </text>
    </g>
  );
}

/** The US as a grid of dots: big Greek-life schools in white, the launch campuses in sage, pulsing together. */
function LaunchMap() {
  return (
    <MapPicker>
      <svg
        className="cr-map"
        viewBox="0 0 960 600"
        role="group"
        aria-label="Dot map of the United States: white dots mark big Greek-life schools, and larger green dots mark the launch campuses, UW–Madison, the University of South Carolina and Clemson. Choose a school to add it to the waiting room."
      >
        <path d={GRID_DOTS} fill="none" stroke={CREAM} strokeOpacity={0.17} strokeWidth={4.6} strokeLinecap="round" style={{ pointerEvents: "none" }} />
        {SCHOOLS.map((s) => {
          const sub = "Click to join the waiting room";
          const w = widthFor(s.name, sub);
          const x = Math.min(Math.max(s.x - w / 2, 4), 956 - w);
          return (
            <g key={s.label} className="cp" data-school={s.name} tabIndex={0} role="button" aria-label={`${s.name}: add to the waiting room`}>
              <circle className="hit" cx={s.x} cy={s.y} r={11} />
              <circle className="ring" cx={s.x} cy={s.y} r={9} />
              <circle className="sd" cx={s.x} cy={s.y} r={3.1} fill="#FFFFFF" fillOpacity={0.5} />
              <Tip label={s.name} sub={sub} x={x} y={s.y - 56} w={w} caret={s.x} />
            </g>
          );
        })}
        {CAMPUSES.map((c) => {
          const sub = "Launching spring 2027";
          const w = widthFor(c.name, sub);
          const x = c.side === 0 ? c.x - w / 2 : c.side < 0 ? c.x - w - 18 : c.x + 18;
          const y = c.side === 0 ? c.y - 58 : c.y - 20;
          return (
            <g key={c.label} className="cp" data-school={c.name} tabIndex={0} role="button" aria-label={`${c.name}, launching spring 2027: add to the waiting room`}>
              <circle className="hit" cx={c.x} cy={c.y} r={14} />
              <circle className="ring" cx={c.x} cy={c.y} r={13} />
              <circle className="cd" cx={c.x} cy={c.y} r={6.2} fill="#7FA884" />
              <Tip label={c.name} sub={sub} x={x} y={y} w={w} caret={c.side === 0 ? c.x : undefined} />
            </g>
          );
        })}
      </svg>
    </MapPicker>
  );
}

export default function Launch() {
  return (
    <section id="launch" className="cr-launch cr-on-dark">
      <div className="cr-glow cr-launch-glow" aria-hidden="true" />
      <div className="cr-launch-in">
        <div className="cr-head" data-reveal>
          <h2 className="cr-h2" style={{ maxWidth: "none" }}>
            where we’re launching.
          </h2>
          <p className="cr-sub">Spring 2027, starting at UW–Madison, the University of South Carolina and Clemson.</p>
        </div>
        <LaunchMap />
        <p className="cr-map-hint">Click any school to add it to the waiting room.</p>
        <WaitingRoom />
      </div>
    </section>
  );
}
