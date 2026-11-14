import { isArrowKey, moveFocus } from '../core/focus';
import type { Board } from '../core/board';

/** Draws the lights and lets the player press them by mouse, touch or keyboard. */
export type GridView = {
  build: (size: number) => void;
  paint: (board: Board) => void;
  focus: () => void;
};

const createCell = (index: number, onPress: (index: number) => void) => {
  const cell = document.createElement('button');
  cell.type = 'button';
  cell.className = 'mg-lights-out-cell';
  cell.setAttribute('role', 'gridcell');
  cell.addEventListener('click', () => onPress(index));
  return cell;
};

/** Mounts the panel of lights inside the grid element; arrow keys move the focus. */
export const mountGrid = (grid: HTMLElement, onPress: (index: number) => void): GridView => {
  let cells: HTMLButtonElement[] = [];
  let size = 0;
  let focused = 0;
  const focusCell = (index: number) => {
    cells[focused]?.setAttribute('tabindex', '-1');
    focused = index;
    cells[focused]?.setAttribute('tabindex', '0');
    cells[focused]?.focus({ preventScroll: true });
  };
  grid.addEventListener('keydown', (event) => {
    if (!isArrowKey(event.key)) return;
    event.preventDefault();
    focusCell(moveFocus(focused, size, event.key));
  });
  return {
    build: (newSize) => {
      size = newSize;
      focused = 0;
      cells = Array.from({ length: size * size }, (_, index) =>
        createCell(index, (pressed) => {
          focusCell(pressed);
          onPress(pressed);
        }),
      );
      cells.forEach((cell, index) => cell.setAttribute('tabindex', index === 0 ? '0' : '-1'));
      grid.style.setProperty('--mg-lights-out-size', String(size));
      grid.replaceChildren(...cells);
    },
    paint: (board) =>
      board.lights.forEach((lit, index) => {
        const cell = cells[index];
        cell.classList.toggle('mg-lights-out-cell--on', lit);
        cell.textContent = lit ? '💡' : '';
        cell.setAttribute('aria-label', lit ? 'Light on' : 'Light off');
      }),
    focus: () => focusCell(focused),
  };
};
