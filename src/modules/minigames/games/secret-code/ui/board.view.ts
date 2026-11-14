import { MAX_TRIES } from '../core/rules';
import { createElement } from './element';
import { createFeedback, createSlots } from './row.view';
import type { GameState } from '../core/game';

const createRow = (state: GameState, index: number) => {
  const row = createElement('li', 'mg-secret-code-row');
  const played = state.guesses[index];
  const isCurrent = !played && index === state.guesses.length && state.status === 'playing';
  if (isCurrent) row.classList.add('mg-secret-code-row--current');
  if (!played && !isCurrent) row.classList.add('mg-secret-code-row--empty');
  const number = createElement('span', 'mg-secret-code-row-number');
  number.textContent = String(index + 1);
  const symbols = played?.symbols ?? (isCurrent ? state.current : []);
  row.append(number, createSlots(symbols), createFeedback(played?.feedback));
  return row;
};

/** Draws the list of all tries: past guesses with clues, the one being built, and the rest. */
export const renderBoard = (board: HTMLElement, state: GameState): void => {
  const rows = Array.from({ length: MAX_TRIES }, (_, index) => createRow(state, index));
  board.replaceChildren(...rows);
};
