import type { Direction } from '../core/cell';

const PAD_BUTTONS: readonly { direction: Direction; icon: string; label: string }[] = [
  { direction: 'up', icon: '▲', label: 'Up' },
  { direction: 'left', icon: '◀', label: 'Left' },
  { direction: 'right', icon: '▶', label: 'Right' },
  { direction: 'down', icon: '▼', label: 'Down' },
];

/** Builds the on-screen arrow buttons, for touch screens and mice. */
export const createPad = (onMove: (direction: Direction) => void) => {
  const pad = document.createElement('div');
  pad.className = 'mg-maze-pad';
  pad.append(
    ...PAD_BUTTONS.map(({ direction, icon, label }) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `mg-maze-pad-button mg-maze-pad-${direction}`;
      button.textContent = icon;
      button.setAttribute('aria-label', label);
      button.addEventListener('click', () => onMove(direction));
      return button;
    }),
  );
  return pad;
};
