import { isDark, pressLight } from './board';
import { LEVEL_SIZES, generateLevel } from './levels';
import { scoreFor } from './score';
import type { Board } from './board';
import type { Level, Random } from './levels';

/** A game in progress: its levels, the current panel and the moves made. */
export type LightsOutState = {
  levels: readonly Level[];
  levelIndex: number;
  board: Board;
  moves: number;
  totalMoves: number;
};

const atLevel = (
  levels: readonly Level[],
  levelIndex: number,
  totalMoves: number,
): LightsOutState => ({
  levels,
  levelIndex,
  board: levels[levelIndex].start,
  moves: 0,
  totalMoves,
});

/** Starts a game on the first of freshly generated levels. */
export const startGame = (random: Random) =>
  atLevel(
    LEVEL_SIZES.map((size) => generateLevel(size, random)),
    0,
    0,
  );

/** Presses a light of the current panel, counting one move. */
export const pressCell = (state: LightsOutState, index: number): LightsOutState => ({
  ...state,
  board: pressLight(state.board, index),
  moves: state.moves + 1,
  totalMoves: state.totalMoves + 1,
});

/** Puts the current level back to its start; moves already made still count in the total. */
export const restartLevel = (state: LightsOutState) =>
  atLevel(state.levels, state.levelIndex, state.totalMoves);

/** Tells whether every light of the current panel is off. */
export const isLevelClear = (state: LightsOutState) => isDark(state.board);

/** Tells whether the current level is the last one. */
export const isLastLevel = (state: LightsOutState) => state.levelIndex === state.levels.length - 1;

/** Moves on to the next level. */
export const nextLevel = (state: LightsOutState) =>
  atLevel(state.levels, state.levelIndex + 1, state.totalMoves);

/** Scores the game from all moves made against the presses that built the levels. */
export const finalScore = (state: LightsOutState) =>
  scoreFor(
    state.totalMoves,
    state.levels.reduce((sum, level) => sum + level.presses, 0),
  );
