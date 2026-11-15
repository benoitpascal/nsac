import { createKeypad, isKeypadDone, isPressed, pressNumber } from '../core/keypad';
import { createButton, createElement, shake } from './panel';
import type { Random } from '../core/random';
import type { PanelEvents } from './panel';

const HINT = '1 → 9';

/** Shows numbered keys in a mixed order; pressing them from smallest to biggest solves it. */
export const createKeypadPanel = (random: Random, events: PanelEvents) => {
  let keypad = createKeypad(random);
  const panel = createElement('div', 'mg-defuse-panel mg-defuse-keypad');
  const grid = createElement('div', 'mg-defuse-keys');
  const keys = keypad.keys.map((value) => {
    const key = createButton('mg-defuse-key', String(value), `number ${value}`);
    key.addEventListener('click', () => {
      const result = pressNumber(keypad, value);
      keypad = result.keypad;
      if (!result.right) {
        events.mistake();
        shake(panel);
        return;
      }
      keys.forEach((other, index) => {
        other.classList.toggle('mg-defuse-key-done', isPressed(keypad, keypad.keys[index]));
      });
      if (isKeypadDone(keypad)) events.solved();
    });
    return key;
  });
  grid.append(...keys);
  panel.append(createElement('div', 'mg-defuse-rule mg-defuse-hint', HINT), grid);
  return panel;
};
