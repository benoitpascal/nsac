import { WALK_WORLDS } from '../core/walk-worlds';
import type { WalkWorld, WalkWorldId } from '../core/walk-worlds';

const OPTION_CLASS = 'speed-picker__option';

/**
 * Fills the picker with one button per world, marks the chosen one as pressed and reports it.
 * The pressed button gives the focus back, so that Space jumps instead of pressing it again.
 */
export const mountWorldPicker = (
  picker: HTMLElement,
  selected: WalkWorldId,
  onSelect: (world: WalkWorld) => void,
) => {
  const buttons = WALK_WORLDS.map((world) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = OPTION_CLASS;
    button.textContent = world.name;
    button.setAttribute('aria-pressed', String(world.id === selected));
    button.addEventListener('click', () => {
      for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
      button.blur();
      onSelect(world);
    });
    return button;
  });
  picker.replaceChildren(...buttons);
};
