import { MAX_SCORE } from '../../../core/minigame';

/**
 * Scores the whole run from the moves used against the moves expected: full score at or under
 * the target, then less as extra moves pile up, never below zero.
 */
export const scoreFor = (movesUsed: number, targetMoves: number) => {
  if (movesUsed <= targetMoves) return MAX_SCORE;
  return Math.max(0, Math.round((MAX_SCORE * targetMoves) / movesUsed));
};
