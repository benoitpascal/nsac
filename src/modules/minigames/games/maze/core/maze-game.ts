import { isSameCell, neighbourOf } from './cell';
import { canMove, generateMaze } from './maze';
import type { Cell, Direction } from './cell';
import type { Maze, RandomSource } from './maze';

/** Width of the maze of each level, in cells. */
export const LEVEL_SIZES: readonly number[] = [7, 9, 11];
/** Time given to cross each level, in milliseconds. */
export const LEVEL_TIME_MS = 60_000;

/** Whether the game goes on, was won after the last level, or was lost when time ran out. */
export type MazeStatus = 'playing' | 'won' | 'lost';

/**
 * The game at one moment: the level being played (or the count of levels done once over),
 * its maze, where the astronaut stands, the time left, and the time left over from levels done.
 */
export type MazeState = {
  level: number;
  maze: Maze;
  astronaut: Cell;
  remainingMs: number;
  savedMs: number;
  status: MazeStatus;
};

const START: Cell = { row: 0, col: 0 };

/** The exit hatch, in the corner opposite the start. */
export const exitOf = (maze: Maze): Cell => ({ row: maze.size - 1, col: maze.size - 1 });

const startLevel = (level: number, savedMs: number, random: RandomSource): MazeState => ({
  level,
  maze: generateMaze(LEVEL_SIZES[level] ?? 0, random),
  astronaut: START,
  remainingMs: LEVEL_TIME_MS,
  savedMs,
  status: 'playing',
});

/** Starts the first level. */
export const startMazeGame = (random: RandomSource) => startLevel(0, 0, random);

/**
 * Moves the astronaut one cell unless a wall blocks it; reaching the hatch opens the next
 * level, or wins the game after the last one.
 */
export const moveAstronaut = (
  state: MazeState,
  direction: Direction,
  random: RandomSource,
): MazeState => {
  if (state.status !== 'playing' || !canMove(state.maze, state.astronaut, direction)) return state;
  const astronaut = neighbourOf(state.astronaut, direction);
  if (!isSameCell(astronaut, exitOf(state.maze))) return { ...state, astronaut };
  const savedMs = state.savedMs + state.remainingMs;
  const level = state.level + 1;
  if (level < LEVEL_SIZES.length) return startLevel(level, savedMs, random);
  return { ...state, astronaut, level, savedMs, status: 'won' };
};

/** Counts down the time of the level; the game is lost when it reaches zero. */
export const passTime = (state: MazeState, elapsedMs: number): MazeState => {
  if (state.status !== 'playing') return state;
  const remainingMs = Math.max(0, state.remainingMs - elapsedMs);
  return { ...state, remainingMs, status: remainingMs === 0 ? 'lost' : 'playing' };
};
