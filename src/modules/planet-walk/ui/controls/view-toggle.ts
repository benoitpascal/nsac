import type { ViewMode } from '../walker-camera';

const LABELS: Record<ViewMode, string> = { first: 'Show astronaut', third: 'First person' };
const TOGGLE_KEY = 'KeyV';

/**
 * Switches between the view from behind the astronaut (the starting one) and the view through
 * its eyes, with the button or the V key; the button tells which view it switches to.
 */
export const createViewToggle = (button: HTMLButtonElement, target: Window) => {
  let mode: ViewMode = 'third';
  const show = () => {
    button.textContent = LABELS[mode];
    button.setAttribute('aria-pressed', String(mode === 'first'));
  };
  const toggle = () => {
    mode = mode === 'third' ? 'first' : 'third';
    show();
  };
  button.addEventListener('click', () => {
    toggle();
    button.blur();
  });
  target.addEventListener('keydown', (event) => {
    if (event.code === TOGGLE_KEY && !event.repeat) toggle();
  });
  show();
  return { mode: (): ViewMode => mode };
};
