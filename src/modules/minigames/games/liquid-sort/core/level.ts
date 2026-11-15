import { TUBE_CAPACITY, disorderOf, moveLayers, roomIn, topRun } from './tubes';
import type { Rack } from './tubes';

/** Returns a number in [0, 1), like Math.random. */
export type RandomSource = () => number;

/** Empty tubes added to every level to make room for pouring. */
export const EMPTY_TUBES = 2;
const SHUFFLE_STEPS = 80;
const ATTEMPTS = 20;
/** A shuffle must break at least this many layer pairs per color to be kept. */
const MIN_DISORDER_PER_COLOR = 1;

type ReverseMove = { from: number; to: number; count: number };

const sortedRack = (colorCount: number): Rack => [
  ...Array.from({ length: colorCount }, (_, color) => Array<number>(TUBE_CAPACITY).fill(color)),
  ...Array.from({ length: EMPTY_TUBES }, () => []),
];

/**
 * Lists the moves that undo a legal pour: taking a run off a tube that leaves it empty or still
 * topped by that color, onto a tube from which the forward pour would move back exactly that run.
 */
const reverseMoves = (rack: Rack): ReverseMove[] =>
  rack.flatMap((source, from) => {
    const run = topRun(source);
    const counts = Array.from({ length: run }, (_, i) => i + 1);
    return counts
      .filter((count) => count < run || count === source.length)
      .flatMap((count) =>
        rack.flatMap((target, to) => {
          if (to === from || roomIn(target) < count) return [];
          const joins =
            target.length > 0 && target[target.length - 1] === source[source.length - 1];
          const backRun = count + (joins ? topRun(target) : 0);
          const backRoom = roomIn(source) + count;
          return Math.min(backRun, backRoom) === count ? [{ from, to, count }] : [];
        }),
      );
  });

const shuffle = (colorCount: number, random: RandomSource) => {
  let rack = sortedRack(colorCount);
  for (let step = 0; step < SHUFFLE_STEPS; step += 1) {
    const moves = reverseMoves(rack);
    const move = moves[Math.floor(random() * moves.length)];
    if (move === undefined) break;
    rack = moveLayers(rack, move.from, move.to, move.count);
  }
  return rack;
};

/**
 * Builds a solvable level: starts from sorted tubes and plays random pours backwards, keeping the
 * most mixed of several tries and rejecting shuffles that stay almost sorted.
 */
export const generateLevel = (colorCount: number, random: RandomSource): Rack => {
  const tries = Array.from({ length: ATTEMPTS }, () => shuffle(colorCount, random));
  const minimum = colorCount * MIN_DISORDER_PER_COLOR;
  const mixed = tries.filter((rack) => disorderOf(rack) >= minimum);
  const pool = mixed.length > 0 ? mixed : tries;
  return pool.reduce((best, rack) => (disorderOf(rack) > disorderOf(best) ? rack : best));
};
