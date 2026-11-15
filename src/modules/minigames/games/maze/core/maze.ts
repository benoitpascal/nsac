import { DIRECTIONS, OPPOSITE, indexOf, isInside, neighbourOf } from './cell';
import type { Cell, Direction } from './cell';

/** Returns a number in [0, 1), like Math.random. */
export type RandomSource = () => number;

/** A square maze: for every cell, read row by row, the directions free of walls. */
export type Maze = { size: number; openings: readonly (readonly Direction[])[] };

const shuffled = <T>(items: readonly T[], random: RandomSource): T[] => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
};

/**
 * Builds a perfect maze (exactly one path between any two cells) with a randomized
 * depth-first search starting from the top left cell.
 */
export const generateMaze = (size: number, random: RandomSource): Maze => {
  const openings: Direction[][] = Array.from({ length: size * size }, () => []);
  const visited = new Set<number>([0]);
  const path: Cell[] = [{ row: 0, col: 0 }];
  for (let cell = path.at(-1); cell; cell = path.at(-1)) {
    const from = cell;
    const direction = shuffled(DIRECTIONS, random).find((candidate) => {
      const next = neighbourOf(from, candidate);
      return isInside(size, next) && !visited.has(indexOf(size, next));
    });
    if (!direction) {
      path.pop();
      continue;
    }
    const next = neighbourOf(from, direction);
    openings[indexOf(size, from)]?.push(direction);
    openings[indexOf(size, next)]?.push(OPPOSITE[direction]);
    visited.add(indexOf(size, next));
    path.push(next);
  }
  return { size, openings };
};

/** Tells whether no wall stops a move from the cell in the given direction. */
export const canMove = (maze: Maze, cell: Cell, direction: Direction) =>
  maze.openings[indexOf(maze.size, cell)]?.includes(direction) ?? false;
