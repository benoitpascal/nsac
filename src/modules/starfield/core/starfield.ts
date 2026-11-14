export type Star = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  twinklePhase: number;
};

export type FieldSize = {
  width: number;
  height: number;
};

const STARS_PER_PIXEL = 1 / 4000;
const MIN_RADIUS = 0.2;
const RADIUS_RANGE = 1.6;
const MIN_SPEED = 0.02;
const SPEED_RANGE = 0.25;
const TWINKLE_STEP = 0.02;
const BASE_OPACITY = 0.65;
const TWINKLE_AMPLITUDE = 0.35;
const FULL_TURN = Math.PI * 2;

const createStar = (size: FieldSize): Star => ({
  x: Math.random() * size.width,
  y: Math.random() * size.height,
  radius: MIN_RADIUS + Math.random() * RADIUS_RANGE,
  speed: MIN_SPEED + Math.random() * SPEED_RANGE,
  twinklePhase: Math.random() * FULL_TURN,
});

/**
 * Creates a star field whose density scales with the given area.
 */
export const createStarfield = (size: FieldSize): Star[] => {
  const count = Math.round(size.width * size.height * STARS_PER_PIXEL);
  return Array.from({ length: count }, () => createStar(size));
};

/**
 * Returns the star moved by one frame, wrapping to the left edge when it leaves the field.
 */
export const advanceStar = (star: Star, size: FieldSize): Star => {
  const x = star.x + star.speed;
  return { ...star, x: x > size.width ? 0 : x, twinklePhase: star.twinklePhase + TWINKLE_STEP };
};

/**
 * Returns the star opacity, oscillating around a base value with its twinkle phase.
 */
export const starOpacity = (star: Star): number =>
  BASE_OPACITY + Math.sin(star.twinklePhase) * TWINKLE_AMPLITUDE;
