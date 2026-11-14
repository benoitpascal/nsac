import type { Hook } from '../core/types';

/** What lies under the pointer: a hook, the tray, or nothing useful. */
export type DropTarget = { kind: 'hook'; hook: Hook } | { kind: 'tray' } | { kind: 'none' };

/** Finds the hook or the tray an element belongs to. */
export const targetOf = (element: Element | null): DropTarget => {
  const hookElement = element?.closest<HTMLElement>('[data-hook-side]');
  if (hookElement) {
    const side = hookElement.dataset.hookSide === 'left' ? 'left' : 'right';
    return { kind: 'hook', hook: { side, distance: Number(hookElement.dataset.hookDistance) } };
  }
  return element?.closest('[data-tray]') ? { kind: 'tray' } : { kind: 'none' };
};

/** Finds the hook or the tray under a point of the screen. */
export const targetAt = (x: number, y: number) => targetOf(document.elementFromPoint(x, y));
