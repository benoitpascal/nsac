import { canAdd, canSubmit } from '../core/game';
import { SYMBOL_COUNT } from '../core/rules';
import { createElement } from './element';
import { createSymbolIcon, SYMBOL_NAMES } from './symbol-icon';
import type { PlayerActions } from './actions';
import type { GameState } from '../core/game';

/** The keypad and how to refresh which of its buttons can be pressed. */
export type Keypad = { element: HTMLElement; update: (state: GameState) => void };

const createButton = (label: string, onClick: () => void, ...classNames: string[]) => {
  const button = createElement('button', 'mg-secret-code-key', ...classNames);
  button.type = 'button';
  button.setAttribute('aria-label', label);
  button.addEventListener('click', onClick);
  return button;
};

const createSymbolKey = (symbol: number, actions: PlayerActions) => {
  const key = createButton(SYMBOL_NAMES[symbol] ?? '', () => actions.add(symbol));
  const shortcut = createElement('span', 'mg-secret-code-shortcut');
  shortcut.textContent = String(symbol + 1);
  key.append(createSymbolIcon(symbol), shortcut);
  return key;
};

/** Builds the symbol buttons with an erase button and an open button. */
export const createKeypad = (actions: PlayerActions): Keypad => {
  const element = createElement('div', 'mg-secret-code-keypad');
  const symbolKeys = Array.from({ length: SYMBOL_COUNT }, (_, symbol) =>
    createSymbolKey(symbol, actions),
  );
  const remove = createButton('Erase', actions.remove, 'mg-secret-code-key--erase');
  remove.textContent = '⌫';
  const submit = createButton('Open', actions.submit, 'mg-secret-code-key--submit');
  submit.textContent = 'Open';
  element.append(...symbolKeys, remove, submit);
  const update = (state: GameState) => {
    symbolKeys.forEach((key, symbol) => (key.disabled = !canAdd(state, symbol)));
    remove.disabled = state.status !== 'playing' || state.current.length === 0;
    submit.disabled = !canSubmit(state);
  };
  return { element, update };
};
