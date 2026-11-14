/**
 * Something solid, seen from above as a box (m), from its bottom to its top height (m): a rock
 * or a wall starts on the ground, a roof or a lintel floats above it.
 */
export type Obstacle = {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  bottom: number;
  top: number;
};

/** Ground spot (m), seen from above. */
export type Spot = { x: number; z: number };

/** How much room a moving body takes (m): its radius seen from above and its height. */
export type Body = { radius: number; height: number };
/** Half the width of the walker's feet (m): how much of a top they need to stand on it. */
const FEET_RADIUS_M = 0.15;
/** Height of the walker from feet to head (m). */
export const BODY_HEIGHT_M = 1.8;
/** The walker's body: half its width and its height. */
export const WALKER_BODY: Body = { radius: 0.3, height: BODY_HEIGHT_M };
/** Highest step (m) the walker climbs without jumping. */
export const STEP_UP_M = 0.35;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const touches = (obstacle: Obstacle, spot: Spot, radius: number) =>
  Math.hypot(
    spot.x - clamp(spot.x, obstacle.minX, obstacle.maxX),
    spot.z - clamp(spot.z, obstacle.minZ, obstacle.maxZ),
  ) < radius;

/** Returns the height (m) of what the feet rest on at the spot: the ground or a top within reach. */
export const floorAt = (obstacles: readonly Obstacle[], spot: Spot, feet: number): number =>
  obstacles.reduce(
    (floor, { top, ...box }) =>
      top <= feet + STEP_UP_M && touches({ top, ...box }, spot, FEET_RADIUS_M)
        ? Math.max(floor, top)
        : floor,
    0,
  );

/** Returns the height (m) of the lowest thing above the head at the spot, if any. */
export const ceilingAt = (obstacles: readonly Obstacle[], spot: Spot, feet: number): number =>
  obstacles.reduce(
    (ceiling, obstacle) =>
      obstacle.bottom > feet + STEP_UP_M && touches(obstacle, spot, WALKER_BODY.radius)
        ? Math.min(ceiling, obstacle.bottom)
        : ceiling,
    Infinity,
  );

/** Whether something too high to step onto stands in the way of the body at the spot. */
const isBlocked = (obstacles: readonly Obstacle[], spot: Spot, feet: number, body: Body) =>
  obstacles.some(
    (obstacle) =>
      obstacle.top > feet + STEP_UP_M &&
      obstacle.bottom < feet + body.height &&
      touches(obstacle, spot, body.radius),
  );

/**
 * Returns where a body (the walker by default) ends up when heading from one spot to another:
 * the wanted spot when free, else sliding along the wall on one axis, else staying put.
 */
export const freeSpot = (
  obstacles: readonly Obstacle[],
  from: Spot,
  to: Spot,
  feet: number,
  body: Body = WALKER_BODY,
) =>
  [to, { x: to.x, z: from.z }, { x: from.x, z: to.z }].find(
    (spot) => !isBlocked(obstacles, spot, feet, body),
  ) ?? from;
