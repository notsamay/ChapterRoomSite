/**
 * Pixel geometry shared by PhoneFrame and scripts/build-screens.mjs.
 *
 * Plain JS so the build script can import it without a TypeScript toolchain.
 */

/** Bezel as a fraction of the frame width. Must match .phone-frame in app/globals.css. */
export const BEZEL = 0.0355;
export const BEZEL_CROP_TOP = 0.0385;

/** Screenshot source size: iPhone 3x, 1206 x 2622. */
export const SHOT_WIDTH = 1206;
export const SHOT_HEIGHT = 2622;

/** Device pixel ratios a variant is rendered for. */
export const VARIANT_SCALES = [1, 1.25, 1.5, 2, 3];

/** Bezel thickness in whole pixels at the frame's full-size width (CSS rounds the same way). */
export function bezelPx(frameWidth, crop = false) {
  return Math.round(frameWidth * (crop ? BEZEL_CROP_TOP : BEZEL));
}

/** Width of the screen inside the bezel, in whole pixels. */
export function screenWidth(frameWidth, crop = false) {
  return frameWidth - 2 * bezelPx(frameWidth, crop);
}

/** Frame height that gives the screen inside exactly the screenshot's aspect ratio. */
export function frameHeight(frameWidth) {
  const sw = screenWidth(frameWidth);
  return Math.round((sw * SHOT_HEIGHT) / SHOT_WIDTH) + 2 * bezelPx(frameWidth);
}
