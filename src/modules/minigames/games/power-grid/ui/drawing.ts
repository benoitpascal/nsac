import { cellAtPointer } from './grid.view';
import type { Cell } from '../core/cell';

/** What a drag on the grid does: a press on a square, then moves over squares. */
export type DrawingHandlers = { press: (cell: Cell) => boolean; drag: (cell: Cell) => void };

/**
 * Listens to mouse and touch drags on the grid. When press returns true, the pointer is captured
 * so the drag keeps following it, and each move is passed to drag until the pointer is released.
 */
export const listenDrawing = (grid: HTMLElement, size: number, handlers: DrawingHandlers) => {
  let drawing = false;
  grid.addEventListener('pointerdown', (event) => {
    drawing = handlers.press(cellAtPointer(grid, size, event));
    if (drawing) grid.setPointerCapture(event.pointerId);
  });
  grid.addEventListener('pointermove', (event) => {
    if (drawing) handlers.drag(cellAtPointer(grid, size, event));
  });
  const release = () => {
    drawing = false;
  };
  grid.addEventListener('pointerup', release);
  grid.addEventListener('pointercancel', release);
};
