import { MAX_SCORE } from '../../../core/minigame';
import { ROUND_COUNT } from './reaction-round';
import type { RoundOutcome } from './reaction-round';
import type { MiniGameResult } from '../../../core/minigame';

/** Valid rounds needed to win. */
export const ROUNDS_TO_WIN = 4;
/** Average reaction (ms) that earns the full score, and the one that earns the lowest. */
const FAST_MS = 250;
const SLOW_MS = 800;
/** Score of an average reaction at SLOW_MS or slower. */
const SLOW_SCORE = 20;

/** Lists the reaction times (ms) of the rounds without a false start. */
export const validTimes = (outcomes: readonly RoundOutcome[]): number[] =>
  outcomes.flatMap((outcome) => (outcome.kind === 'time' ? [outcome.ms] : []));

/** Returns the mean of the valid reaction times (ms), or undefined when there is none. */
export const averageTime = (outcomes: readonly RoundOutcome[]): number | undefined => {
  const times = validTimes(outcomes);
  if (times.length === 0) return undefined;
  return times.reduce((sum, ms) => sum + ms, 0) / times.length;
};

const speedScore = (averageMs: number) => {
  const slowness = Math.min(Math.max((averageMs - FAST_MS) / (SLOW_MS - FAST_MS), 0), 1);
  return MAX_SCORE - slowness * (MAX_SCORE - SLOW_SCORE);
};

/**
 * Scores the test: won with enough valid rounds, scored by the average reaction time; lost
 * otherwise, with that score cut in proportion to the valid rounds.
 */
export const scoreReflexes = (outcomes: readonly RoundOutcome[]): MiniGameResult => {
  const average = averageTime(outcomes);
  if (average === undefined) return { won: false, score: 0 };
  const valid = validTimes(outcomes).length;
  const won = valid >= ROUNDS_TO_WIN;
  const share = won ? 1 : valid / ROUND_COUNT;
  return { won, score: Math.round(speedScore(average) * share) };
};
