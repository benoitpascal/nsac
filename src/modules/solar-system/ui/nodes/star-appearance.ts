import { Color } from 'three';

/** Star color by B−V index, from hot blue-white to cool orange-red. */
const COLOR_STOPS: [number, Color][] = [
  [-0.4, new Color(0.62, 0.72, 1)],
  [0, new Color(0.82, 0.87, 1)],
  [0.6, new Color(1, 0.96, 0.9)],
  [1, new Color(1, 0.85, 0.68)],
  [1.5, new Color(1, 0.72, 0.47)],
  [2, new Color(1, 0.6, 0.36)],
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/** Returns the color of a star from its B−V color index. */
export const starColor = (colorIndex: number) => {
  const upper = COLOR_STOPS.findIndex(([index]) => index >= colorIndex);
  if (upper === 0) return COLOR_STOPS[0][1];
  if (upper === -1) return COLOR_STOPS[COLOR_STOPS.length - 1][1];
  const [lowIndex, lowColor] = COLOR_STOPS[upper - 1];
  const [highIndex, highColor] = COLOR_STOPS[upper];
  return lowColor.clone().lerp(highColor, (colorIndex - lowIndex) / (highIndex - lowIndex));
};

/** Returns the on-screen size (CSS pixels) of a star of the given magnitude. */
export const starPointSize = (magnitude: number) => clamp(5 - 0.55 * magnitude, 1.8, 8);
/** Returns the glow intensity (0–1) of a star of the given magnitude. */
export const starBrightness = (magnitude: number) => clamp(1.25 - 0.12 * magnitude, 0.4, 1);
