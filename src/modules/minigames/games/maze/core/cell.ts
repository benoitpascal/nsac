/** A way to go from a cell to the next one. */
export type Direction = 'up' | 'down' | 'left' | 'right';

/** A cell of the maze by row and column, both counted from 0 at the top left. */
export type Cell = { row: number; col: number };

/** Every direction, in a fixed order. */
export const DIRECTIONS: readonly Direction[] = ['up', 'down', 'left', 'right'];

const STEPS: Record<Direction, Cell> = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
};

/** The direction that leads back. */
export const OPPOSITE: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

/** Returns the cell next to the given one in the given direction. */
export const neighbourOf = (cell: Cell, direction: Direction): Cell => ({
  row: cell.row + STEPS[direction].row,
  col: cell.col + STEPS[direction].col,
});

/** Tells whether the cell lies inside a square grid of the given size. */
export const isInside = (size: number, cell: Cell) =>
  cell.row >= 0 && cell.col >= 0 && cell.row < size && cell.col < size;

/** Returns the position of the cell in a square grid read row by row. */
export const indexOf = (size: number, cell: Cell) => cell.row * size + cell.col;

/** Tells whether two cells are the same. */
export const isSameCell = (first: Cell, second: Cell) =>
  first.row === second.row && first.col === second.col;
