import { CODE_LENGTH } from '../core/rules';
import { createElement } from './element';
import { createSymbolIcon } from './symbol-icon';
import type { Feedback, SymbolId } from '../core/rules';

/** Draws CODE_LENGTH slots, filled with the given symbols and left empty after them. */
export const createSlots = (symbols: readonly SymbolId[]): HTMLElement => {
  const slots = createElement('div', 'mg-secret-code-slots');
  for (let index = 0; index < CODE_LENGTH; index += 1) {
    const slot = createElement('span', 'mg-secret-code-slot');
    const symbol = symbols[index];
    if (symbol !== undefined) slot.append(createSymbolIcon(symbol));
    slots.append(slot);
  }
  return slots;
};

const createDot = (kind: 'exact' | 'misplaced' | 'none') =>
  createElement('span', 'mg-secret-code-dot', `mg-secret-code-dot--${kind}`);

/** Draws the clue dots of a guess: filled for right place, hollow for wrong place. */
export const createFeedback = (feedback?: Feedback): HTMLElement => {
  const dots = createElement('div', 'mg-secret-code-feedback');
  const exact = feedback?.exact ?? 0;
  const misplaced = feedback?.misplaced ?? 0;
  for (let index = 0; index < CODE_LENGTH; index += 1) {
    if (index < exact) dots.append(createDot('exact'));
    else if (index < exact + misplaced) dots.append(createDot('misplaced'));
    else dots.append(createDot('none'));
  }
  if (feedback) {
    dots.setAttribute('aria-label', `${exact} right place, ${misplaced} wrong place`);
  }
  return dots;
};
