import { MAX_SCORE } from '../../../core/minigame';
import { HIT_WEIGHT, PROMPT_COUNT, SPEED_WEIGHT, START_SHIELDS } from './rules';
import type { MiniGameResult } from '../../../core/minigame';
import type { Answer } from './prompt';

/** Progress of a flight: prompts answered, shields left, right answers and summed speed. */
export type Tally = { asked: number; shields: number; hits: number; speedSum: number };

/** A flight before the first prompt. */
export const startTally = (): Tally => ({
  asked: 0,
  shields: START_SHIELDS,
  hits: 0,
  speedSum: 0,
});

/** Counts an answer: a right one scores, a wrong or late one costs a shield. */
export const recordAnswer = (tally: Tally, answer: Answer): Tally => ({
  asked: tally.asked + 1,
  shields: answer.hit ? tally.shields : tally.shields - 1,
  hits: tally.hits + Number(answer.hit),
  speedSum: tally.speedSum + answer.speed,
});

/** The flight ends when the shields run out or every prompt is answered. */
export const isFlightOver = (tally: Tally) => tally.shields <= 0 || tally.asked >= PROMPT_COUNT;

/** Result of a finished flight: won with a shield left, scored on right answers and speed. */
export const flightResult = (tally: Tally): MiniGameResult => ({
  won: tally.shields > 0,
  score: Math.round(
    (MAX_SCORE * (HIT_WEIGHT * tally.hits + SPEED_WEIGHT * tally.speedSum)) / PROMPT_COUNT,
  ),
});
