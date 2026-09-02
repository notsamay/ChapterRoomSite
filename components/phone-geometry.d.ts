export const BEZEL: number;
export const BEZEL_CROP_TOP: number;
export const SHOT_WIDTH: number;
export const SHOT_HEIGHT: number;
export const VARIANT_SCALES: number[];
export function bezelPx(frameWidth: number, crop?: boolean): number;
export function screenWidth(frameWidth: number, crop?: boolean): number;
export function frameHeight(frameWidth: number): number;
