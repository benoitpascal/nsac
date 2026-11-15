/** Keys that press each light, in light order: top, right, bottom, left. */
const LIGHT_KEYS: readonly (readonly string[])[] = [
  ['1', 'ArrowUp'],
  ['2', 'ArrowRight'],
  ['3', 'ArrowDown'],
  ['4', 'ArrowLeft'],
];

/** Returns the light a key presses, or -1 when the key presses none. */
export const lightForKey = (key: string) => LIGHT_KEYS.findIndex((keys) => keys.includes(key));
