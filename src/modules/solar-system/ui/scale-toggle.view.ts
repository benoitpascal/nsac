import type { ScaleMode } from './nodes/display-scale';

const LABELS: Record<ScaleMode, string> = {
  easy: 'Real scale',
  real: 'Easy view',
};
const NEXT_MODE: Record<ScaleMode, ScaleMode> = { easy: 'real', real: 'easy' };

/**
 * Wires the button switching between the easy view (enlarged bodies, compressed distances) and
 * the real scale. The button names the scale it switches to, and is pressed at real scale.
 */
export const mountScaleToggle = (
  button: HTMLButtonElement,
  initialMode: ScaleMode,
  onChange: (mode: ScaleMode) => void,
) => {
  let mode = initialMode;
  const show = () => {
    button.textContent = LABELS[mode];
    button.setAttribute('aria-pressed', String(mode === 'real'));
  };
  button.addEventListener('click', () => {
    mode = NEXT_MODE[mode];
    show();
    onChange(mode);
  });
  show();
};
