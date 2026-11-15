/** Row and column steps of the arrow keys. */
const ARROW_STEPS: Partial<Record<string, readonly [number, number]>> = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
};

const clamp = (value: number, size: number) => Math.min(Math.max(value, 0), size - 1);

/** Tells whether the key moves the focus on the panel. */
export const isArrowKey = (key: string) => ARROW_STEPS[key] !== undefined;

/** Returns the light focused after pressing the key, staying on the panel's edges. */
export const moveFocus = (index: number, size: number, key: string) => {
  const step = ARROW_STEPS[key];
  if (!step) return index;
  const row = clamp(Math.floor(index / size) + step[0], size);
  const column = clamp((index % size) + step[1], size);
  return row * size + column;
};
