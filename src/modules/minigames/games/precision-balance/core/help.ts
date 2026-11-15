import { findHint } from './hint';
import type { Hint } from './hint';
import type { Session } from './session';

/** Wrong tries on a level (see Session.wrongTries) before the Hint button shows up. */
export const WRONG_TRIES_BEFORE_HINT = 2;

/** The Hint button shows up after WRONG_TRIES_BEFORE_HINT wrong tries on the current level. */
export const canAskHint = (session: Session) =>
  session.wrongTries >= WRONG_TRIES_BEFORE_HINT && findHint(session.weights) !== null;

/** Gives the next helpful move and counts the hint (it lowers the score), or null if none. */
export const askHint = (session: Session): { session: Session; hint: Hint } | null => {
  if (!canAskHint(session)) return null;
  const hint = findHint(session.weights);
  return hint === null ? null : { session: { ...session, hints: session.hints + 1 }, hint };
};
