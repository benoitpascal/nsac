import { nextMirror } from '../core/focus';
import type { Point } from '../core/board';

const ARROWS: Partial<Record<string, Point>> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

/**
 * Lets arrow keys move the focus between mirror buttons on the grid, with only the focused one
 * in the tab order (Space and Enter already press a focused button).
 */
export const wireArrowFocus = (
  grid: HTMLElement,
  buttons: readonly HTMLButtonElement[],
  points: readonly Point[],
) => {
  let current = 0;
  const select = (index: number) => {
    current = index;
    buttons.forEach((button, at) => (button.tabIndex = at === index ? 0 : -1));
  };
  select(0);
  buttons.forEach((button, index) => button.addEventListener('focus', () => select(index)));
  grid.addEventListener('keydown', (event) => {
    const step = ARROWS[event.key];
    if (!step) return;
    event.preventDefault();
    select(nextMirror(points, current, step));
    buttons[current]?.focus();
  });
};
