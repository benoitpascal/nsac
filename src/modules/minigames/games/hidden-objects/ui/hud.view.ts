import { HINT_COST_MS, HUNT_DURATION_MS, canTakeHint } from '../core/hunt';
import type { Hunt } from '../core/hunt';

/** The clock and the hint button, with ways to update them. */
export type Hud = {
  clock: HTMLElement;
  hint: HTMLButtonElement;
  show: (hunt: Hunt) => void;
};

const MS_PER_SECOND = 1000;
const PERCENT = 100;
const LOW_TIME_MS = 15_000;

/**
 * Creates the clock, a shrinking bar with the seconds left, and the hint button, enabled only
 * while a hint can be bought.
 */
export const createHud = (): Hud => {
  const clock = document.createElement('div');
  clock.className = 'mg-hidden-objects-clock';
  const fill = document.createElement('span');
  fill.className = 'mg-hidden-objects-clock-fill';
  const seconds = document.createElement('span');
  seconds.className = 'mg-hidden-objects-clock-seconds';
  clock.append(fill, seconds);
  const hint = document.createElement('button');
  hint.type = 'button';
  hint.className = 'mg-hidden-objects-hint-button';
  hint.textContent = `Hint -${HINT_COST_MS / MS_PER_SECOND}s`;
  const show = (hunt: Hunt) => {
    const { remainingMs } = hunt;
    hint.disabled = !canTakeHint(hunt);
    seconds.textContent = `${Math.ceil(remainingMs / MS_PER_SECOND)}s`;
    fill.style.width = `${(remainingMs / HUNT_DURATION_MS) * PERCENT}%`;
    clock.classList.toggle('is-low', remainingMs <= LOW_TIME_MS);
  };
  return { clock, hint, show };
};
