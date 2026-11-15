import type { Obstacle } from './obstacles';

/** A point in the walker's world (m), y up. */
export type Point = { x: number; y: number; z: number };

const STEP_M = 0.1;
const MARGIN_M = 0.3;
const MIN_DISTANCE_M = 0.6;
const LOWEST_EYE_M = 0.2;
/** Halvings of the last step, to find where the wall starts to within a few millimeters. */
const REFINE_STEPS = 5;

const isInside = (obstacle: Obstacle, point: Point) =>
  point.x > obstacle.minX &&
  point.x < obstacle.maxX &&
  point.z > obstacle.minZ &&
  point.z < obstacle.maxZ &&
  point.y > obstacle.bottom &&
  point.y < obstacle.top;

/**
 * Returns how far (m, at most the given distance) a camera can stand from the target along the
 * unit direction before going into an obstacle or under the ground, keeping a small margin, so
 * that a wall or a ceiling never comes between the camera and the walker.
 */
export const clearDistance = (
  obstacles: readonly Obstacle[],
  target: Point,
  direction: Point,
  distance: number,
): number => {
  const blockedAt = (step: number) => {
    const point = {
      x: target.x + direction.x * step,
      y: target.y + direction.y * step,
      z: target.z + direction.z * step,
    };
    return point.y < LOWEST_EYE_M || obstacles.some((obstacle) => isInside(obstacle, point));
  };
  for (let step = STEP_M; step <= distance; step += STEP_M) {
    if (!blockedAt(step)) continue;
    let [free, blocked] = [step - STEP_M, step];
    for (let refine = 0; refine < REFINE_STEPS; refine++) {
      const middle = (free + blocked) / 2;
      if (blockedAt(middle)) blocked = middle;
      else free = middle;
    }
    return Math.max(free - MARGIN_M, MIN_DISTANCE_M);
  }
  return distance;
};
