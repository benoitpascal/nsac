import type { Point } from './board';

/** A sideways cell counts as this many cells ahead when picking the next mirror. */
const SIDEWAYS_WEIGHT = 2;

/**
 * Index of the mirror reached by moving from the given one along a step (an arrow key): the
 * closest mirror ahead, preferring the same row or column. Stays put when none is ahead.
 */
export const nextMirror = (mirrors: readonly Point[], from: number, step: Point): number => {
  const origin = mirrors[from];
  if (!origin) return from;
  let best = from;
  let bestCost = Infinity;
  mirrors.forEach((mirror, index) => {
    const dx = mirror.x - origin.x;
    const dy = mirror.y - origin.y;
    const ahead = dx * step.x + dy * step.y;
    const sideways = Math.abs(dx * step.y - dy * step.x);
    const cost = ahead + sideways * SIDEWAYS_WEIGHT;
    if (ahead > 0 && cost < bestCost) {
      best = index;
      bestCost = cost;
    }
  });
  return best;
};
