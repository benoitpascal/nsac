/** A square of the grid, by row and column counted from the top-left corner. */
export type Cell = { row: number; col: number };

/** Whether both are the same square. */
export const sameCell = (first: Cell, second: Cell) =>
  first.row === second.row && first.col === second.col;

/** Whether both squares share a side. */
export const areNeighbours = (first: Cell, second: Cell) =>
  Math.abs(first.row - second.row) + Math.abs(first.col - second.col) === 1;

/** The square next to the given one, one step toward the target (rows first when farther). */
export const stepToward = (from: Cell, target: Cell): Cell => {
  const rowGap = target.row - from.row;
  const colGap = target.col - from.col;
  return Math.abs(rowGap) >= Math.abs(colGap)
    ? { row: from.row + Math.sign(rowGap), col: from.col }
    : { row: from.row, col: from.col + Math.sign(colGap) };
};
