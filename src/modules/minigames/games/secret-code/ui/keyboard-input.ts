import { SYMBOL_COUNT } from '../core/rules';
import type { PlayerActions } from './actions';

const DIGIT_KEY = /^(?:Digit|Numpad)([1-9])$/;
const REMOVE_KEYS = new Set(['Backspace', 'Delete']);
const SUBMIT_KEYS = new Set(['Enter', 'NumpadEnter']);

const symbolOf = (code: string) => {
  const digit = DIGIT_KEY.exec(code)?.[1];
  const symbol = digit === undefined ? -1 : Number(digit) - 1;
  return symbol < SYMBOL_COUNT ? symbol : -1;
};

/**
 * Plays from the keyboard: keys 1 to 6 add a symbol, Backspace erases, Enter tries the guess.
 * Returns how to stop listening.
 */
export const listenKeyboard = (target: Window, actions: PlayerActions): (() => void) => {
  const onKeyDown = (event: KeyboardEvent) => {
    const symbol = symbolOf(event.code);
    if (symbol >= 0) actions.add(symbol);
    else if (REMOVE_KEYS.has(event.code)) actions.remove();
    else if (SUBMIT_KEYS.has(event.code)) actions.submit();
    else return;
    event.preventDefault();
  };
  target.addEventListener('keydown', onKeyDown);
  return () => target.removeEventListener('keydown', onKeyDown);
};
