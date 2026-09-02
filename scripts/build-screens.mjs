/**
 * Pre-scales every screenshot in public/screens/ to the exact pixel widths the phones draw
 * them at, for 1x, 1.25x, 1.5x, 2x and 3x displays.
 *
 * A browser shrinking the 1206px original to ~300px softens the UI text, and so does drawing
 * a 300px image at 299.2px. So the bezel is a whole number of pixels (see .phone-frame in
 * globals.css), the screen inside it is a whole number of pixels, and this script renders each
 * shot at precisely that width times each device pixel ratio. PhoneFrame lists the same set in
 * its srcset, so the browser fetches a 1:1 image and never resamples.
 *
 * Run after dropping new shots in:  npm run screens
 */
import { readdir, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { screenWidth, VARIANT_SCALES } from "../components/phone-geometry.mjs";

/** Which frame each shot sits in: the frame's full-size width and whether it's a crop-top card. */
const FRAMES = {
  "home": { width: 322 },
  "check-in": { width: 284 },
  "excuses": { width: 284 },
  "roles": { width: 316 },
  "poll": { width: 276 },
  "chat": { width: 276 },
  "announcements": { width: 276 },
  "screenshot-logged": { width: 372 },
  "vouchers": { width: 260, crop: true },
  "album": { width: 260, crop: true },
  "register": { width: 284 },
};

const dir = path.resolve("public/screens");
const files = await readdir(dir);

// Clear old variants so renamed or resized frames don't leave strays behind.
for (const f of files) if (/-\d+\.png$/.test(f)) await unlink(path.join(dir, f));

for (const file of files.filter((f) => /^[a-z-]+\.png$/.test(f))) {
  const base = file.replace(/\.png$/, "");
  const frame = FRAMES[base];
  if (!frame) {
    console.warn(`${file}: no frame listed in scripts/build-screens.mjs, skipped`);
    continue;
  }
  const input = sharp(path.join(dir, file));
  const { width: original } = await input.metadata();
  const sw = screenWidth(frame.width, frame.crop);
  const widths = VARIANT_SCALES.map((s) => Math.round(sw * s)).filter((w) => w < original);
  for (const w of widths) {
    const scale = w / sw;
    let img = input.clone().resize({ width: w, kernel: sharp.kernel.lanczos3 });
    // On 1x and 1.25x displays the UI text is only ~9px tall, so a mild unsharp mask after
    // the downscale keeps strokes from reading as mush. Higher densities don't need it.
    if (scale <= 1.5) img = img.sharpen({ sigma: 0.7, m1: 0.6, m2: 0.3 });
    await img.png({ compressionLevel: 9, palette: false }).toFile(path.join(dir, `${base}-${w}.png`));
  }
  console.log(`${file}: screen ${sw}px -> ${widths.join(", ")}`);
}
