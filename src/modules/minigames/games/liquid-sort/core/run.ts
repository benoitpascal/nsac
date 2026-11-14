import { createLevel, movesOf } from './game';
import { scoreFor } from './score';
import type { SortLevel } from './game';
import type { RandomSource } from './level';

/** The whole game: the level being played and the moves used and expected in finished levels. */
export type SortRun = { level: SortLevel; movesDone: number; targetDone: number };

/** Starts the game at the first level. */
export const startRun = (random: RandomSource): SortRun => ({
  level: createLevel(0, random),
  movesDone: 0,
  targetDone: 0,
});

/** Banks the solved level's moves and opens the next level. */
export const nextLevel = (run: SortRun, random: RandomSource): SortRun => ({
  level: createLevel(run.level.index + 1, random),
  movesDone: run.movesDone + movesOf(run.level),
  targetDone: run.targetDone + run.level.targetMoves,
});

/** Final score once the last level is solved, counting every level. */
export const finalScore = (run: SortRun) =>
  scoreFor(run.movesDone + movesOf(run.level), run.targetDone + run.level.targetMoves);
