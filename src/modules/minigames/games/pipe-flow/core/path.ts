import { ALL_SIDES, indexOf, neighbourOf, shuffled } from './grid';
import type { Cell, Random } from './grid';

/**
 * Returns a random winding path of neighbouring cells, each visited once, from `start` to `end`
 * (a depth-first walk that tries the directions in random order).
 */
export const randomPath = (start: Cell, end: Cell, size: number, random: Random): Cell[] => {
  const visited = new Set([indexOf(start, size)]);
  const path = [start];
  while (path.length > 0) {
    const current = path[path.length - 1];
    if (current.row === end.row && current.column === end.column) return path;
    const next = shuffled(ALL_SIDES, random)
      .map((side) => neighbourOf(current, side, size))
      .find((cell) => cell !== undefined && !visited.has(indexOf(cell, size)));
    if (next) {
      visited.add(indexOf(next, size));
      path.push(next);
    } else {
      path.pop();
    }
  }
  return [start];
};
