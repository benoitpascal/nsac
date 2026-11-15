import { MAX_SCORE } from '../../../core/minigame';

/** Points lost for each move beyond the fewest possible. */
const EXTRA_MOVE_PENALTY = 3;
/** Seconds the player may take without losing points. */
const FREE_SECONDS = 45;
/** Points lost for each second beyond the free time. */
const SECOND_PENALTY = 0.3;
/** Points lost for each hint the player asks for. */
export const HINT_PENALTY = 5;
/** A won game never scores less than this. */
const MIN_WIN_SCORE = 10;

/**
 * Score of a won game from the moves made, the fewest moves that could solve every level, the
 * seconds spent and the hints used.
 */
export const computeScore = (moves: number, minimumMoves: number, seconds: number, hints = 0) => {
  const extraMoves = Math.max(0, moves - minimumMoves);
  const extraSeconds = Math.max(0, seconds - FREE_SECONDS);
  const score =
    MAX_SCORE -
    extraMoves * EXTRA_MOVE_PENALTY -
    extraSeconds * SECOND_PENALTY -
    hints * HINT_PENALTY;
  return Math.round(Math.max(MIN_WIN_SCORE, Math.min(MAX_SCORE, score)));
};
