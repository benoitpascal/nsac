import type { WalkWorldId } from '../core/walk-worlds';

/** How a world looks from its ground: colors, haze, sunlight and whether stars show by day. */
export type WorldAppearance = {
  ground: [string, string];
  rock: number;
  sky: number;
  /** Haze thickness: 0 for no air at all. */
  haze: number;
  sunlight: number;
  /** Light coming from everywhere at once: the glow of the sky, or sunlight bouncing off the ground. */
  fill: number;
  stars: boolean;
  /** Real stars, Milky Way, Earth and a Sun moving with the local time, as seen from the Moon's south pole. */
  lunarSky?: boolean;
};

/** Ground, sky and light of each world. */
export const WORLD_APPEARANCES: Record<WalkWorldId, WorldAppearance> = {
  moon: {
    ground: ['#b4b5ba', '#6f6f6f'],
    rock: 0x9a9a9a,
    sky: 0x000000,
    haze: 0,
    sunlight: 3,
    stars: true,
    fill: 0.12,
    lunarSky: true,
  },
  mercury: {
    ground: ['#7d7268', '#5e554d'],
    rock: 0x8a7f74,
    sky: 0x000000,
    haze: 0,
    sunlight: 3,
    stars: true,
    fill: 0.6,
  },
  mars: {
    ground: ['#b5653a', '#8e4a28'],
    rock: 0x7a3d22,
    sky: 0xd8a97c,
    haze: 0.004,
    sunlight: 1.4,
    stars: false,
    fill: 0.6,
  },
  venus: {
    ground: ['#9b7a4b', '#7a5c34'],
    rock: 0x6b5030,
    sky: 0xd9a44f,
    haze: 0.03,
    sunlight: 0.5,
    stars: false,
    fill: 0.6,
  },
  earth: {
    ground: ['#5f8a3c', '#4a6f2e'],
    rock: 0x7d7a72,
    sky: 0x8ec9ff,
    haze: 0.003,
    sunlight: 2,
    stars: false,
    fill: 0.6,
  },
};
