import { generateLevel, LEVEL_COUNT } from './level-generator';
import { moveWeight } from './moves';
import { isBalanced } from './torque';
import type { Hook, Random, Weight } from './types';

/**
 * A game in progress: its levels as they start, the current one, its weights, the moves, the
 * wrong tries on the current level and the hints used in the whole game.
 */
export type Session = {
  levels: readonly (readonly Weight[])[];
  levelIndex: number;
  weights: readonly Weight[];
  moves: number;
  /** Times every weight hung on the arm but the arm tilted, on the current level. */
  wrongTries: number;
  hints: number;
};

/** Starts a game on the first of LEVEL_COUNT freshly generated levels. */
export const startSession = (random: Random): Session => {
  const levels = Array.from({ length: LEVEL_COUNT }, (_, index) => generateLevel(index, random));
  return { levels, levelIndex: 0, weights: levels[0] ?? [], moves: 0, wrongTries: 0, hints: 0 };
};

/** Fewest moves that solve every level: one per free weight. */
export const minimumMoves = (session: Session) =>
  session.levels.flat().filter((weight) => !weight.locked).length;

/** A wrong try: every weight hangs on the arm, yet the arm tilts. */
const isWrongTry = (weights: readonly Weight[]) =>
  weights.every((weight) => weight.hook !== null) && !isBalanced(weights);

/**
 * Moves a weight (see moveWeight) and counts the move when something changed, and the wrong
 * try when the move hangs the last weight on a tilting arm or leaves a full arm tilting.
 */
export const playMove = (session: Session, id: number, hook: Hook | null): Session => {
  const weights = moveWeight(session.weights, id, hook);
  if (weights === session.weights) return session;
  const wrongTries = session.wrongTries + (isWrongTry(weights) ? 1 : 0);
  return { ...session, weights, moves: session.moves + 1, wrongTries };
};

/** Puts the current level back as it started, keeping the moves made and the wrong tries. */
export const resetLevel = (session: Session): Session => ({
  ...session,
  weights: session.levels[session.levelIndex] ?? session.weights,
});

/** Goes to the next level, or returns null after the last one. */
export const nextLevel = (session: Session): Session | null => {
  const levelIndex = session.levelIndex + 1;
  const weights = session.levels[levelIndex];
  return weights === undefined ? null : { ...session, levelIndex, weights, wrongTries: 0 };
};
