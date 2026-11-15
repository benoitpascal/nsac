import { MAX_SCORE } from '../../../core/minigame';

/**
 * Scores the whole game: full marks when the player used no more moves than the random presses
 * that built the levels, then less and less as moves grow.
 */
export const scoreFor = (moves: number, presses: number) =>
  moves <= presses ? MAX_SCORE : Math.round((MAX_SCORE * presses) / moves);
