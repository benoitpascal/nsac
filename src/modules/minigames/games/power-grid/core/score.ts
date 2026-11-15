import { MAX_SCORE } from '../../../core/minigame';

/** Points lost each time the player resets a level. */
const RESET_PENALTY = 10;

/** Score when the last level is solved: full marks minus a penalty per reset, never below 0. */
export const scoreFor = (resets: number) => Math.max(0, MAX_SCORE - resets * RESET_PENALTY);
