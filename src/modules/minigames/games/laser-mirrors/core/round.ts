import { MAX_SCORE } from '../../../core/minigame';
import { isSolved, traceBeam } from './beam';
import { flipped, parseLevel } from './board';
import type { Board, Level, Mirror } from './board';

/** One level being played: its board, the current mirror leans and the flips used so far. */
export type Round = { board: Board; leans: readonly Mirror[]; flips: number };

/** Starts a level with its mirrors in their starting leans. */
export const startRound = (level: Level): Round => {
  const board = parseLevel(level);
  return { board, leans: board.start, flips: 0 };
};

/** Returns the round after flipping the mirror at the given index (reading order). */
export const flipMirror = (round: Round, index: number): Round => ({
  ...round,
  leans: round.leans.map((lean, at) => (at === index ? flipped(lean) : lean)),
  flips: round.flips + 1,
});

const countBits = (mask: number) => mask.toString(2).replaceAll('0', '').length;

/** Fewest flips that light every receiver from the starting leans (Infinity if unsolvable). */
export const fewestFlips = (board: Board): number => {
  const total = board.start.length;
  let fewest = Infinity;
  for (let mask = 0; mask < 1 << total; mask += 1) {
    const leans = board.start.map((lean, index) => (mask & (1 << index) ? flipped(lean) : lean));
    if (isSolved(traceBeam(board, leans))) fewest = Math.min(fewest, countBits(mask));
  }
  return fewest;
};

/** Score from 0 to MAX_SCORE: full when no flip was wasted, less for each extra one. */
export const scoreFor = (fewest: number, used: number) =>
  used <= 0 ? MAX_SCORE : Math.round(MAX_SCORE * Math.min(1, fewest / used));
