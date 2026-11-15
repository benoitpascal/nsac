import { craterRelief, hillHeight, layeredNoise } from './relief';

/** Gentle waves of the ground (m), shown by light and shade only on the flat part. */
const SWELL = { size: 30, height: 0.6 };
/** Shade of the dust: darker and lighter patches (fraction of the base color). */
const PATCHES = { size: 80, depth: 0.25 };

/** Height of the ground as light sees it: hills, craters and swells (m). */
export const shadedHeight = (x: number, z: number) =>
  hillHeight(x, z) + craterRelief(x, z) + layeredNoise(x, z, SWELL.size) * SWELL.height;

/** Shade of the ground at a spot: dust patches, with fresh bright rims around the craters. */
export const groundShade = (x: number, z: number) => {
  const patch =
    1 - PATCHES.depth + PATCHES.depth * 2 * layeredNoise(x - 500, z + 700, PATCHES.size);
  return Math.min(patch + Math.max(craterRelief(x, z), -0.5) * 0.3, 1.2);
};
