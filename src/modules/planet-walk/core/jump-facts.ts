import { JUMP_SPEED } from './walker';
import { EARTH_GRAVITY } from './walk-worlds';

/** How a jump goes under a given gravity, for the same push of the legs. */
export type JumpFacts = {
  /** Highest point of the feet, in m. */
  heightM: number;
  /** Time from take-off to landing, in s. */
  airSeconds: number;
  /** Weight compared to the weight on the Earth (1 on the Earth). */
  weightShare: number;
};

/** Returns how high and how long a jump lasts under the given gravity (m/s²). */
export const jumpFacts = (gravity: number): JumpFacts => ({
  heightM: JUMP_SPEED ** 2 / (2 * gravity),
  airSeconds: (2 * JUMP_SPEED) / gravity,
  weightShare: gravity / EARTH_GRAVITY,
});
