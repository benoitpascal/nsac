import { randomIndex } from './grid';
import type { Cell, Random } from './grid';

/**
 * Returns a gentle random path of neighbouring cells from `start` (left edge) to `end` (right
 * edge): it never goes back left, and only climbs or drops towards the tank's row, so a young
 * player can follow it with a finger. It still bends at random column breaks.
 */
export const randomPath = (start: Cell, end: Cell, size: number, random: Random): Cell[] => {
  const path = [start];
  let { row, column } = start;
  // Column where the path turns towards the tank's row; the rest of the way stays straight.
  const bendAt = randomIndex(random, size);
  while (column < end.column || row !== end.row) {
    if (column >= bendAt && row !== end.row) row += Math.sign(end.row - row);
    else column += 1;
    path.push({ row, column });
  }
  return path;
};
