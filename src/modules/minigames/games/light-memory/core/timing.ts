/** How long a light stays on for the first round (ms). */
const FIRST_ON_MS = 600;
/** The shortest a light stays on, however long the sequence (ms). */
const SHORTEST_ON_MS = 300;
/** How much shorter each light gets for every light added to the sequence (ms). */
const SPEED_UP_MS = 40;
/** Pause between two lights, as a share of the time a light stays on. */
const GAP_RATIO = 0.4;

/** How long each light stays on while a sequence of this length is shown (ms). */
export const lightOnMs = (length: number) =>
  Math.max(SHORTEST_ON_MS, FIRST_ON_MS - (length - 1) * SPEED_UP_MS);

/** Pause between two lights while a sequence of this length is shown (ms). */
export const lightGapMs = (length: number) => Math.round(lightOnMs(length) * GAP_RATIO);
