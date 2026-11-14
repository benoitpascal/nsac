import { LEVEL_SIZES, LEVEL_TIME_MS } from './maze-game';
import { MAX_SCORE } from '../../../core/minigame';
import type { MazeState } from './maze-game';
import type { MiniGameResult } from '../../../core/minigame';

/** Share of the highest score earned just by winning; the rest comes from the time left. */
const WIN_SHARE = 0.5;
/** Share of the highest score shared out among the levels done when time runs out. */
const LOSS_SHARE = 0.5;

/**
 * Turns a finished game into its result: a win scores at least half, plus the time left over;
 * a loss scores the levels done, always below a win.
 */
export const mazeResult = (state: MazeState): MiniGameResult => {
  const levelCount = LEVEL_SIZES.length;
  if (state.status === 'won') {
    const timeShare = state.savedMs / (levelCount * LEVEL_TIME_MS);
    return { won: true, score: Math.round(MAX_SCORE * (WIN_SHARE + (1 - WIN_SHARE) * timeShare)) };
  }
  return { won: false, score: Math.round((MAX_SCORE * LOSS_SHARE * state.level) / levelCount) };
};
