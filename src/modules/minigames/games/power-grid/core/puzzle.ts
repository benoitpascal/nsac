import { sameCell } from './cell';
import type { Cell } from './cell';

/** A cable of the solution: its first square and its moves, one letter (U, D, L, R) per square. */
export type SolutionPath = { start: Cell; moves: string };

/** A handcrafted level: grid side and the solution cables, which fill every square together. */
export type Level = { size: number; solution: readonly SolutionPath[] };

/** The two sockets of one colour. */
export type SocketPair = readonly [Cell, Cell];

/** What the player sees: grid side and the two sockets of each colour (index = colour). */
export type Puzzle = { size: number; sockets: readonly SocketPair[] };

const stepOf = (move: string): Cell => {
  switch (move) {
    case 'U':
      return { row: -1, col: 0 };
    case 'D':
      return { row: 1, col: 0 };
    case 'L':
      return { row: 0, col: -1 };
    case 'R':
      return { row: 0, col: 1 };
    default:
      throw new Error(`Unknown move "${move}" in a power grid level`);
  }
};

/** Squares a solution cable goes through, from its first socket to its second one. */
export const pathCells = (path: SolutionPath): Cell[] =>
  [...path.moves].reduce(
    (cells, move) => {
      const last = cells[cells.length - 1];
      const step = stepOf(move);
      return [...cells, { row: last.row + step.row, col: last.col + step.col }];
    },
    [path.start],
  );

/** The puzzle of a level: the sockets are both ends of each solution cable. */
export const puzzleOf = (level: Level): Puzzle => ({
  size: level.size,
  sockets: level.solution.map((path) => {
    const cells = pathCells(path);
    return [cells[0], cells[cells.length - 1]] as const;
  }),
});

/** Colour of the socket on that square, or -1 when there is none. */
export const socketColourAt = (puzzle: Puzzle, cell: Cell) =>
  puzzle.sockets.findIndex((pair) => pair.some((socket) => sameCell(socket, cell)));
