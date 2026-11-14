import { indexOf, neighbourOf } from './grid';
import { openingsOf, oppositeOf } from './tiles';
import type { Cell } from './grid';
import type { Side, Tile } from './tiles';

/**
 * A square board of tiles, row by row. Water enters the source cell through its left side and
 * must leave the tank cell through its right side.
 */
export type Board = { size: number; tiles: readonly Tile[]; source: Cell; tank: Cell };

/** Side through which the water enters the source cell, from the ice drill. */
export const SOURCE_SIDE: Side = 3;
/** Side through which the water leaves the tank cell, into the greenhouse tank. */
export const TANK_SIDE: Side = 1;

const opensOn = (board: Board, cell: Cell, side: Side) =>
  openingsOf(board.tiles[indexOf(cell, board.size)]).includes(side);

/** Returns the indexes of the cells the water reaches from the source through connected pipes. */
export const wetCells = (board: Board): Set<number> => {
  const wet = new Set<number>();
  if (!opensOn(board, board.source, SOURCE_SIDE)) return wet;
  const queue = [board.source];
  wet.add(indexOf(board.source, board.size));
  for (let cell = queue.shift(); cell; cell = queue.shift()) {
    for (const side of openingsOf(board.tiles[indexOf(cell, board.size)])) {
      const next = neighbourOf(cell, side, board.size);
      if (!next || wet.has(indexOf(next, board.size))) continue;
      if (!opensOn(board, next, oppositeOf(side))) continue;
      wet.add(indexOf(next, board.size));
      queue.push(next);
    }
  }
  return wet;
};

/** Tells whether the water flows from the source all the way into the tank. */
export const isSolved = (board: Board) =>
  wetCells(board).has(indexOf(board.tank, board.size)) && opensOn(board, board.tank, TANK_SIDE);
