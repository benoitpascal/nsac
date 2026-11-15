import { generateLevel, LEVEL_COUNT } from './level-generator';
import { moveWeight } from './moves';
import type { Hook, Random, Weight } from './types';

/** A game in progress: its levels as they start, the current one, its weights and the moves. */
export type Session = {
  levels: readonly (readonly Weight[])[];
  levelIndex: number;
  weights: readonly Weight[];
  moves: number;
};

/** Starts a game on the first of LEVEL_COUNT freshly generated levels. */
export const startSession = (random: Random): Session => {
  const levels = Array.from({ length: LEVEL_COUNT }, (_, index) => generateLevel(index, random));
  return { levels, levelIndex: 0, weights: levels[0] ?? [], moves: 0 };
};

/** Fewest moves that solve every level: one per free weight. */
export const minimumMoves = (session: Session) =>
  session.levels.flat().filter((weight) => !weight.locked).length;

/** Moves a weight (see moveWeight) and counts the move when something changed. */
export const playMove = (session: Session, id: number, hook: Hook | null): Session => {
  const weights = moveWeight(session.weights, id, hook);
  return weights === session.weights ? session : { ...session, weights, moves: session.moves + 1 };
};

/** Puts the current level back as it started, keeping the moves made. */
export const resetLevel = (session: Session): Session => ({
  ...session,
  weights: session.levels[session.levelIndex] ?? session.weights,
});

/** Goes to the next level, or returns null after the last one. */
export const nextLevel = (session: Session): Session | null => {
  const levelIndex = session.levelIndex + 1;
  const weights = session.levels[levelIndex];
  return weights === undefined ? null : { ...session, levelIndex, weights };
};
