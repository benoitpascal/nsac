import type { ViewMode } from '../walker-camera';

const TOGGLE_KEY = 'KeyV';

/**
 * Switches between the view through the astronaut's eyes and the view from behind them with the
 * V key (also the touch pad's View button, which presses it), starting in the given one.
 */
export const createViewToggle = (target: Window, start: ViewMode) => {
  let mode: ViewMode = start;
  target.addEventListener('keydown', (event) => {
    if (event.code === TOGGLE_KEY && !event.repeat) mode = mode === 'third' ? 'first' : 'third';
  });
  return { mode: (): ViewMode => mode };
};
