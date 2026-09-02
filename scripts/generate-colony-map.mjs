/**
 * Pre-renders the colony map so the site ships zero mapping JavaScript.
 *
 * The design prototype drew this with d3 + topojson in an iframe, fetching a 114 KB
 * TopoJSON at runtime. Nothing about the map is interactive, so we project it once
 * here and commit the path data instead.
 *
 * Usage (deps are not part of the site's dependencies — install them ad hoc):
 *   npm i --no-save d3-geo topojson-client topojson-simplify
 *   node scripts/generate-colony-map.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import { presimplify, simplify, quantile } from "topojson-simplify";

const SOURCE = "https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/states-10m.json";
const OUT = path.join(process.cwd(), "components", "colony-map-data.ts");
const KEEP = 0.1; // fraction of points retained by the simplifier
const DECIMALS = 1;
const HIGHLIGHT = ["45", "55"]; // South Carolina, Wisconsin — the current colony states
const REF_W = 1000;
const REF_H = 620;
const PAD = 6;

const CITIES = [
  { city: "Clemson, SC", school: "Clemson University", coords: [-82.837, 34.678], side: "left" },
  { city: "Columbia, SC", school: "University of South Carolina", coords: [-81.035, 34.001], side: "right" },
  { city: "Madison, WI", school: "University of Wisconsin–Madison", coords: [-89.408, 43.076], side: "left" },
];

const raw = await fetch(SOURCE).then((r) => r.json());
const pre = presimplify(raw);
const topo = simplify(pre, quantile(pre, KEEP));

const nation = feature(topo, topo.objects.nation);
const states = feature(topo, topo.objects.states);
const borders = mesh(topo, topo.objects.states, (a, b) => a !== b);

const projection = geoAlbersUsa().fitExtent(
  [
    [0, 0],
    [REF_W, REF_H],
  ],
  nation
);
const geo = geoPath(projection);

// Crop the viewBox to the nation's own bounds so the SVG has no dead margin.
const [[x0, y0], [x1, y1]] = geo.bounds(nation);
const box = { x: x0 - PAD, y: y0 - PAD, w: x1 - x0 + PAD * 2, h: y1 - y0 + PAD * 2 };

const round = (d) =>
  d.replace(/-?\d+\.?\d*/g, (n) => {
    const v = Number(n);
    return String(Number.isInteger(v) ? v : Number(v.toFixed(DECIMALS)));
  });

// Simplification collapses the smallest islands to a point. They render as nothing, so
// drop any subpath that no longer spans a visible distance.
const MIN_SPAN = 0.6;
const dropDegenerate = (d) =>
  d
    .split("M")
    .filter(Boolean)
    .filter((sub) => {
      const nums = sub.match(/-?\d+\.?\d*/g)?.map(Number) ?? [];
      const xs = nums.filter((_, i) => i % 2 === 0);
      const ys = nums.filter((_, i) => i % 2 === 1);
      if (!xs.length || !ys.length) return false;
      return Math.max(...xs) - Math.min(...xs) >= MIN_SPAN || Math.max(...ys) - Math.min(...ys) >= MIN_SPAN;
    })
    .map((sub) => `M${sub}`)
    .join("");

const trim = (d) => dropDegenerate(round(d));

const nationPath = trim(geo(nation));
const bordersPath = trim(geo(borders));

const pct = ([x, y]) => ({
  left: Number((((x - box.x) / box.w) * 100).toFixed(3)),
  top: Number((((y - box.y) / box.h) * 100).toFixed(3)),
});

// One path per state so the map can react to each one; the centroid anchors its tooltip.
const states_ = states.features
  .map((f) => {
    // Territories (PR, etc.) fall outside geoAlbersUsa and project to nothing.
    const raw = geo(f);
    if (!raw) return null;
    const d = trim(raw);
    const c = pct(geo.centroid(f));
    return { id: f.id, name: f.properties.name, d, left: c.left, top: c.top };
  })
  .filter(Boolean)
  .sort((a, b) => a.name.localeCompare(b.name));

const pins = CITIES.map(({ city, school, coords, side }) => {
  const p = projection(coords);
  if (!p) throw new Error(`geoAlbersUsa could not project ${city}`);
  return { city, school, side, ...pct(p) };
});

const file = `// GENERATED FILE — do not edit by hand.
// Source: us-atlas@3.0.1 states-10m.json, simplified to ${KEEP * 100}% of its points and
// pre-projected with d3-geo (geoAlbersUsa). Run \`node scripts/generate-colony-map.mjs\` to rebuild.

export const MAP_VIEWBOX = "${box.x.toFixed(2)} ${box.y.toFixed(2)} ${box.w.toFixed(2)} ${box.h.toFixed(2)}";
export const MAP_ASPECT = ${(box.w / box.h).toFixed(4)};

/** FIPS ids of the states Chapter Room already has colonies in. */
export const COLONY_STATE_IDS: string[] = ${JSON.stringify(HIGHLIGHT)};

export type MapState = {
  id: string;
  name: string;
  d: string;
  /** Centroid, as percentages of the viewBox — where a tooltip anchors. */
  left: number;
  top: number;
};

export type ColonyPin = {
  city: string;
  school: string;
  side: "left" | "right";
  left: number;
  top: number;
};

/** Outline of the lower 48 + AK/HI insets, stroked as the coast. */
export const NATION_PATH =
  "${nationPath}";

/** Interior state borders only (shared edges drawn once). */
export const BORDERS_PATH =
  "${bordersPath}";

export const STATES: MapState[] = ${JSON.stringify(states_, null, 2)};

export const COLONY_PINS: ColonyPin[] = ${JSON.stringify(pins, null, 2)};
`;

fs.writeFileSync(OUT, file);
console.log(`wrote ${path.relative(process.cwd(), OUT)} — ${(file.length / 1024).toFixed(1)} KiB`);
console.log(`viewBox ${box.x.toFixed(1)} ${box.y.toFixed(1)} ${box.w.toFixed(1)} ${box.h.toFixed(1)} (aspect ${(box.w / box.h).toFixed(3)})`);
