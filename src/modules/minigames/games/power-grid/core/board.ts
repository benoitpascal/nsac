import { sameCell } from './cell';
import type { Cell } from './cell';
import type { Puzzle } from './puzzle';

/** A puzzle being played: the cable drawn for each colour, from one of its sockets. */
export type Board = { puzzle: Puzzle; cables: readonly (readonly Cell[])[] };

/** A board with no cable drawn yet. */
export const emptyBoard = (puzzle: Puzzle): Board => ({
  puzzle,
  cables: puzzle.sockets.map(() => []),
});

/** Colour of the cable going through that square, or -1 when it is free. */
export const cableColourAt = (board: Board, cell: Cell) =>
  board.cables.findIndex((cable) => cable.some((square) => sameCell(square, cell)));

/** Whether the cable of that colour joins its two sockets. */
export const isLinked = (board: Board, colour: number) => {
  const cable = board.cables[colour];
  const [first, second] = board.puzzle.sockets[colour];
  const last = cable[cable.length - 1];
  const partner = cable.length > 0 && sameCell(cable[0], first) ? second : first;
  return cable.length > 1 && sameCell(last, partner);
};

/** Whether every pair is linked and the cables fill every square. */
export const isSolved = (board: Board) => {
  const filled = board.cables.reduce((total, cable) => total + cable.length, 0);
  const allLinked = board.cables.every((_, colour) => isLinked(board, colour));
  return allLinked && filled === board.puzzle.size * board.puzzle.size;
};

/** The board with the cable of that colour replaced. */
export const withCable = (board: Board, colour: number, cable: readonly Cell[]): Board => ({
  ...board,
  cables: board.cables.map((current, index) => (index === colour ? cable : current)),
});

/** The board where the cable through that square is cut just before it. */
export const cutAt = (board: Board, cell: Cell): Board => {
  const colour = cableColourAt(board, cell);
  if (colour < 0) return board;
  const cable = board.cables[colour];
  return withCable(
    board,
    colour,
    cable.slice(
      0,
      cable.findIndex((s) => sameCell(s, cell)),
    ),
  );
};
