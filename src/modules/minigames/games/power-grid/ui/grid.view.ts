import { cableColourAt } from '../core/board';
import { socketColourAt } from '../core/puzzle';
import { createCableLayer, drawCables } from './cable-lines';
import type { Board } from '../core/board';
import type { Cell } from '../core/cell';
import type { Puzzle } from '../core/puzzle';

/** One symbol per colour, so players who mix up colours can still match the sockets. */
const SYMBOLS = ['●', '▲', '■', '◆', '★', '✚', '♥', '☾'];

/** The grid on screen: its element, and how to show a board on it. */
export type GridView = { element: HTMLElement; show: (board: Board) => void };

const createSquare = (puzzle: Puzzle, cell: Cell) => {
  const square = document.createElement('div');
  const colour = socketColourAt(puzzle, cell);
  if (colour >= 0) {
    const socket = document.createElement('span');
    socket.className = `mg-power-grid-socket mg-power-grid-c${colour}`;
    socket.textContent = SYMBOLS[colour % SYMBOLS.length];
    square.append(socket);
  }
  return square;
};

/** Builds the squares, sockets and cable layer of a puzzle. */
export const createGrid = (puzzle: Puzzle): GridView => {
  const element = document.createElement('div');
  element.className = 'mg-power-grid-grid';
  element.style.setProperty('--mg-power-grid-size', String(puzzle.size));
  const cells = Array.from({ length: puzzle.size * puzzle.size }, (_, index) => ({
    row: Math.floor(index / puzzle.size),
    col: index % puzzle.size,
  }));
  const squares = cells.map((cell) => createSquare(puzzle, cell));
  const layer = createCableLayer(puzzle.size);
  element.append(layer, ...squares);
  const show = (board: Board) => {
    drawCables(layer, board);
    squares.forEach((square, index) => {
      const colour = cableColourAt(board, cells[index]);
      square.className =
        colour < 0
          ? 'mg-power-grid-square'
          : `mg-power-grid-square mg-power-grid-square--filled mg-power-grid-c${colour}`;
    });
  };
  return { element, show };
};

/** The square under the pointer, kept inside the grid. */
export const cellAtPointer = (grid: HTMLElement, size: number, event: PointerEvent): Cell => {
  const box = grid.getBoundingClientRect();
  const clamp = (value: number) => Math.min(size - 1, Math.max(0, Math.floor(value * size)));
  return {
    row: clamp((event.clientY - box.top) / box.height),
    col: clamp((event.clientX - box.left) / box.width),
  };
};
