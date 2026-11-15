import { MAX_SCORE } from '../../../core/minigame';
import { isSolved } from './flow';
import { generateLevel } from './level';
import { rotateTile } from './tiles';
import type { Random } from './grid';
import type { Level } from './level';

/** Grid size of each level, in order: 3×3, then 4×4 twice (small enough for 7-year-olds). */
export const LEVEL_SIZES: readonly number[] = [3, 4, 4];

/**
 * Where the player is: which level (from 0), its board, the turns made on it, whether the water
 * reaches the tank, and the turns and par summed over the levels already solved.
 */
export type PipeGame = {
  levelNumber: number;
  level: Level;
  moves: number;
  solved: boolean;
  doneMoves: number;
  donePar: number;
};

const openLevel = (levelNumber: number, random: Random) => ({
  levelNumber,
  level: generateLevel(LEVEL_SIZES[levelNumber], random),
  moves: 0,
  solved: false,
});

/** Starts on the first level. */
export const startPipeGame = (random: Random): PipeGame => ({
  ...openLevel(0, random),
  doneMoves: 0,
  donePar: 0,
});

/** Returns the game after turning the tile at the given index; a solved level stays as it is. */
export const turnTileAt = (game: PipeGame, index: number): PipeGame => {
  if (game.solved) return game;
  const tiles = game.level.tiles.map((tile, at) => (at === index ? rotateTile(tile) : tile));
  const level = { ...game.level, tiles };
  const solved = isSolved(level);
  const moves = game.moves + 1;
  const done = solved
    ? { doneMoves: game.doneMoves + moves, donePar: game.donePar + level.par }
    : {};
  return { ...game, ...done, level, moves, solved };
};

/** Tells whether the solved level was the last one. */
export const isLastLevel = (game: PipeGame) => game.levelNumber === LEVEL_SIZES.length - 1;

/** Returns the game on the next level. */
export const nextLevel = (game: PipeGame, random: Random): PipeGame => ({
  ...game,
  ...openLevel(game.levelNumber + 1, random),
});

/** Score from 0 to 100: full marks when the solved levels took no more turns than their par. */
export const scoreOf = (game: PipeGame) =>
  game.doneMoves === 0 ? 0 : Math.round(MAX_SCORE * Math.min(1, game.donePar / game.doneMoves));
