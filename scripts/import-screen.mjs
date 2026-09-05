/**
 * Import a raw simulator screenshot into public/screens/.
 *
 *   node scripts/import-screen.mjs "<simulator screenshot>.png" <slot>
 *
 * Simulator shots carry a live status bar (clock, wifi, battery) and every phone on the page
 * would show a different time. This paints that strip over with the screen's own background
 * so the shots match, then writes public/screens/<slot>.png. Run `npm run screens` afterwards
 * to regenerate the pre-scaled variants.
 */
import path from "node:path";
import sharp from "sharp";
import { SHOT_WIDTH, SHOT_HEIGHT } from "../components/phone-geometry.mjs";

/** Height of the status bar strip, in source pixels. App headers start well below this. */
const STATUS_BAR = 150;

const [, , src, slot] = process.argv;
if (!src || !/^[a-z-]+$/.test(slot ?? "")) {
  console.error('usage: node scripts/import-screen.mjs "<file>.png" <slot>');
  process.exit(1);
}

const image = sharp(src);
const { width, height } = await image.metadata();
if (width !== SHOT_WIDTH || height !== SHOT_HEIGHT) {
  console.error(`${src}: expected ${SHOT_WIDTH}x${SHOT_HEIGHT}, got ${width}x${height}`);
  process.exit(1);
}

// Sample the background just below the strip, at the left edge where nothing is drawn.
const [r, g, b] = await image
  .clone()
  .extract({ left: 8, top: STATUS_BAR + 4, width: 1, height: 1 })
  .removeAlpha()
  .raw()
  .toBuffer();

const out = path.join("public", "screens", `${slot}.png`);
await image
  .composite([
    {
      input: { create: { width, height: STATUS_BAR, channels: 3, background: { r, g, b } } },
      top: 0,
      left: 0,
    },
  ])
  .png({ compressionLevel: 9, palette: false })
  .toFile(out);

console.log(`${out} <- ${path.basename(src)}  (status bar filled with rgb(${r},${g},${b}))`);
