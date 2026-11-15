import type { Obstacle } from '../../core/obstacles';

/** A rock lying on the ground: its place (m), size (m) and how it is turned (radians). */
export type Rock = { x: number; z: number; size: number; tilt: number; turn: number };

/** A round patch of ground (m) where no rock lies. */
export type Clearing = { x: number; z: number; radius: number };

const ROCK_COUNT = 400;
const SPREAD_M = 300;
const MIN_SIZE_M = 0.2;
const MAX_SIZE_M = 1.6;
const START_CLEARING_M = 4;
/** Rocks are flattened to 0.6 of their width and sunk to 0.3 of it. */
const TOP_IN_SIZES = 0.9;
const HALF_WIDTH_IN_SIZES = 0.8;

/** Repeatable pseudo-random numbers in [0, 1), so that every visit shows the same rocks. */
const randomFrom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) % 4_294_967_296;
    return state / 4_294_967_296;
  };
};

/** Scatters rocks of various sizes around the start, leaving the start and the clearing free. */
export const layOutRocks = (clearing: Clearing): Rock[] => {
  const random = randomFrom(42);
  return Array.from({ length: ROCK_COUNT }, () => {
    const angle = random() * Math.PI * 2;
    const distance = START_CLEARING_M + random() * SPREAD_M;
    const size = MIN_SIZE_M + random() ** 3 * (MAX_SIZE_M - MIN_SIZE_M);
    const [tilt, turn] = [random() * 3, random() * 3];
    return { x: Math.cos(angle) * distance, z: Math.sin(angle) * distance, size, tilt, turn };
  }).filter((rock) => Math.hypot(rock.x - clearing.x, rock.z - clearing.z) >= clearing.radius);
};

/** Returns the box each rock fills, to bump into or climb on. */
export const rockObstacles = (rocks: Rock[]): Obstacle[] =>
  rocks.map(({ x, z, size }) => {
    const half = size * HALF_WIDTH_IN_SIZES;
    return {
      minX: x - half,
      maxX: x + half,
      minZ: z - half,
      maxZ: z + half,
      bottom: 0,
      top: size * TOP_IN_SIZES,
    };
  });
