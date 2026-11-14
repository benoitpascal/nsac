import { randomIndex, shuffle } from './random';
import type { Random } from './random';

/** Numbers on the keys (in their shuffled places) and how many are pressed in order so far. */
export type Keypad = { keys: number[]; pressed: number };

const KEY_COUNT = 5;
const HIGHEST_NUMBER = 20;

const pickNumbers = (random: Random) => {
  const numbers = new Set<number>();
  while (numbers.size < KEY_COUNT) numbers.add(1 + randomIndex(random, HIGHEST_NUMBER));
  return [...numbers];
};

/** Builds a keypad of different numbers placed in a random order. */
export const createKeypad = (random: Random): Keypad => ({
  keys: shuffle(random, pickNumbers(random)),
  pressed: 0,
});

/** Number that must be pressed next: the smallest one not pressed yet. */
export const nextNumber = (keypad: Keypad) =>
  [...keypad.keys].sort((first, second) => first - second)[keypad.pressed];

/** Returns the keypad after pressing a number, and whether it was the right one. */
export const pressNumber = (keypad: Keypad, value: number) => {
  const right = value === nextNumber(keypad);
  return { keypad: right ? { ...keypad, pressed: keypad.pressed + 1 } : keypad, right };
};

/** Tells whether every number was pressed in order. */
export const isKeypadDone = (keypad: Keypad) => keypad.pressed >= keypad.keys.length;

/** Tells whether this number was already pressed. */
export const isPressed = (keypad: Keypad, value: number) =>
  isKeypadDone(keypad) || value < nextNumber(keypad);
