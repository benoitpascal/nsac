import { areNeighbours, sameCell, stepToward } from './cell';
import { cableColourAt, cutAt, isLinked, withCable } from './board';
import { socketColourAt } from './puzzle';
import type { Board } from './board';
import type { Cell } from './cell';

/** The board after a press, with the colour now being drawn (-1 when nothing is drawn). */
export type Drawing = { board: Board; colour: number };

const shortenTo = (board: Board, colour: number, cell: Cell): Board => {
  const cable = board.cables[colour];
  return withCable(board, colour, cable.slice(0, cable.findIndex((s) => sameCell(s, cell)) + 1));
};

/**
 * Pressing a socket starts its cable again from there; pressing a square of a cable keeps the
 * cable up to that square, to go on drawing from it. Anywhere else draws nothing.
 */
export const pressCell = (board: Board, cell: Cell): Drawing => {
  const socketColour = socketColourAt(board.puzzle, cell);
  if (socketColour >= 0)
    return { board: withCable(board, socketColour, [cell]), colour: socketColour };
  const cableColour = cableColourAt(board, cell);
  if (cableColour < 0) return { board, colour: -1 };
  return { board: shortenTo(board, cableColour, cell), colour: cableColour };
};

const stepTo = (board: Board, colour: number, cell: Cell): Board => {
  const cable = board.cables[colour];
  const last = cable[cable.length - 1];
  if (cable.length === 0 || !areNeighbours(last, cell)) return board;
  if (cable.some((square) => sameCell(square, cell))) return shortenTo(board, colour, cell);
  if (isLinked(board, colour)) return board;
  const socketColour = socketColourAt(board.puzzle, cell);
  if (socketColour >= 0 && socketColour !== colour) return board;
  const freed = cutAt(board, cell);
  return withCable(freed, colour, [...freed.cables[colour], cell]);
};

/**
 * Drags the cable of that colour toward the square, one square at a time: going back over the
 * cable shortens it, a free square or another cable's square (which gets cut) lengthens it.
 * It stops at a socket of another colour and once it reaches its partner socket.
 */
export const dragTo = (board: Board, colour: number, target: Cell): Board => {
  const cable = board.cables[colour];
  const last = cable[cable.length - 1];
  if (cable.length === 0 || sameCell(last, target)) return board;
  const next = stepTo(board, colour, stepToward(last, target));
  return next === board ? board : dragTo(next, colour, target);
};
