import type { Side } from './tiles';

/** Returns a number in [0, 1), like Math.random; injected so levels can be replayed in tests. */
export type Random = () => number;

/** A cell of a square grid, by row and column from the top left. */
export type Cell = { row: number; column: number };

const STEPS: Record<Side, Cell> = {
  0: { row: -1, column: 0 },
  1: { row: 0, column: 1 },
  2: { row: 1, column: 0 },
  3: { row: 0, column: -1 },
};

/** All sides, clockwise from the top. */
export const ALL_SIDES: readonly Side[] = [0, 1, 2, 3];

/** Returns the index of a cell in a row-by-row list. */
export const indexOf = (cell: Cell, size: number) => cell.row * size + cell.column;

/** Returns the neighbour of a cell on the given side, or undefined past the grid edge. */
export const neighbourOf = (cell: Cell, side: Side, size: number): Cell | undefined => {
  const row = cell.row + STEPS[side].row;
  const column = cell.column + STEPS[side].column;
  const inside = row >= 0 && row < size && column >= 0 && column < size;
  return inside ? { row, column } : undefined;
};

/** Returns the side of `from` that touches its neighbour `to`. */
export const sideTowards = (from: Cell, to: Cell): Side =>
  ALL_SIDES.find(
    (side) =>
      from.row + STEPS[side].row === to.row && from.column + STEPS[side].column === to.column,
  ) ?? 0;

/** Returns a random whole number from 0 up to, but not including, `count`. */
export const randomIndex = (random: Random, count: number) => Math.floor(random() * count);

/** Returns a shuffled copy of the items. */
export const shuffled = <T>(items: readonly T[], random: Random): T[] => {
  const copy = [...items];
  for (let last = copy.length - 1; last > 0; last -= 1) {
    const other = randomIndex(random, last + 1);
    [copy[last], copy[other]] = [copy[other], copy[last]];
  }
  return copy;
};
