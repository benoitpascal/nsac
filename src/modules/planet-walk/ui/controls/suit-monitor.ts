import { FULL_SUIT, needsRescue, stepSuit } from '../../core/suit/suit-supply';
import type { SuitEffort, SuitKit, SuitSupply } from '../../core/suit/suit-supply';

/** How long (s) the screen takes to fade to black before the crew brings the astronaut back. */
const FADE_SECONDS = 1.6;
const LOW_LEVEL = 25;

/**
 * Shows the suit's battery (the HUD's energy ring) and oxygen (its O₂ bar), which drain outside and refill inside the base. When one
 * reaches the rescue level, the screen fades to black and onRescue runs once it is dark.
 */
export const createSuitMonitor = (
  hud: HTMLElement,
  fade: HTMLElement,
  kit: SuitKit,
  onRescue: () => void,
) => {
  let supply: SuitSupply = FULL_SUIT;
  let darkIn = 0;
  const show = (level: 'oxygen' | 'battery', value: number) => {
    const text = `${Math.round(value)}%`;
    const label = hud.querySelector<HTMLElement>(`[data-suit="${level}"]`);
    if (label && label.textContent !== text) label.textContent = text;
    hud.querySelector<HTMLElement>(`[data-suit-fill="${level}"]`)?.style.setProperty('width', text);
  };
  const render = () => {
    show('oxygen', supply.oxygen);
    show('battery', supply.battery);
    hud.style.setProperty('--energy', String(supply.battery));
    hud.classList.toggle('suit-hud--low', Math.min(supply.oxygen, supply.battery) < LOW_LEVEL);
  };
  return {
    /** Moves the suit on; returns true on the frame the astronaut must be carried back to the base. */
    update: (seconds: number, effort: SuitEffort, outside: boolean): boolean => {
      if (darkIn > 0) {
        darkIn -= seconds;
        if (darkIn > 0) return false;
        supply = FULL_SUIT;
        fade.classList.remove('rescue-fade--on');
        onRescue();
        return true;
      }
      supply = stepSuit(supply, effort, outside, kit, seconds);
      render();
      if (outside && needsRescue(supply)) {
        darkIn = FADE_SECONDS;
        fade.classList.add('rescue-fade--on');
      }
      return false;
    },
  };
};
