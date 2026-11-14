import { MAX_SCORE } from '../../../core/minigame';

/** How many symbols make up the secret code. */
export const CODE_LENGTH = 4;
/** How many different symbols the player can choose from. */
export const SYMBOL_COUNT = 6;
/** How many guesses the player has before the airlock stays shut. */
export const MAX_TRIES = 8;
/** Score won when the code is cracked on the very last try. */
export const LAST_TRY_SCORE = 30;

/** One of the symbols, numbered from 0 to SYMBOL_COUNT - 1. */
export type SymbolId = number;

/** How close a guess is: symbols at the right place, and right symbols at the wrong place. */
export type Feedback = { exact: number; misplaced: number };

const SCORE_STEP = (MAX_SCORE - LAST_TRY_SCORE) / (MAX_TRIES - 1);

/** Score of a cracked code: the full score at the first try, down to LAST_TRY_SCORE at the last. */
export const scoreForTries = (triesUsed: number): number =>
  Math.round(MAX_SCORE - (triesUsed - 1) * SCORE_STEP);
