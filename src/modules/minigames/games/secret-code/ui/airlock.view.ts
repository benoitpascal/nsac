import { createElement } from './element';
import { createSlots } from './row.view';
import type { GameState } from '../core/game';

const LABELS = { playing: 'Locked', won: 'Open!', lost: 'Code was' } as const;

/** Draws the airlock door: the hidden code while playing, revealed once the game is over. */
export const renderAirlock = (airlock: HTMLElement, state: GameState): void => {
  airlock.className = `mg-secret-code-airlock mg-secret-code-airlock--${state.status}`;
  const label = createElement('span', 'mg-secret-code-airlock-label');
  label.textContent = LABELS[state.status];
  const lock = createElement('span', 'mg-secret-code-lock');
  lock.setAttribute('aria-hidden', 'true');
  const shown = state.status === 'playing' ? [] : state.code;
  const slots = createSlots(shown);
  slots.classList.add('mg-secret-code-slots--code');
  airlock.replaceChildren(lock, label, slots);
};
