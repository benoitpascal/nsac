import type { ViewMode } from '../walker-camera';

const TOGGLE_KEY = 'KeyV';

/**
 * Switches between the view from behind the astronaut (the starting one) and the view through
 * its eyes with the V key (also the touch pad's View button, which presses it).
 */
export const createViewToggle = (target: Window) => {
  let mode: ViewMode = 'third';
  target.addEventListener('keydown', (event) => {
    if (event.code === TOGGLE_KEY && !event.repeat) mode = mode === 'third' ? 'first' : 'third';
  });
  return { mode: (): ViewMode => mode };
};
