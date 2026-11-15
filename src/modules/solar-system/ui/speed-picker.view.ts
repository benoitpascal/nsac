import { SIMULATION_SPEEDS } from '../core/simulation-speeds';

const OPTION_CLASS = 'speed-picker__option';

/**
 * Fills the picker with one button per simulation speed, marks the selected one as pressed,
 * and reports the chosen speed in simulated days per second.
 */
export const mountSpeedPicker = (
  picker: HTMLElement,
  selectedDaysPerSecond: number,
  onSelect: (daysPerSecond: number) => void,
) => {
  const buttons = SIMULATION_SPEEDS.map((speed) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = OPTION_CLASS;
    button.textContent = speed.label;
    button.setAttribute('aria-pressed', String(speed.daysPerSecond === selectedDaysPerSecond));
    button.addEventListener('click', () => {
      for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
      onSelect(speed.daysPerSecond);
    });
    return button;
  });
  picker.replaceChildren(...buttons);
};
