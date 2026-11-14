/** Number of directions the co-pilot calls during one flight. */
export const PROMPT_COUNT = 20;
/** Shields at take-off: each wrong or late answer costs one. */
export const START_SHIELDS = 3;
/** Time to answer the first prompt, in milliseconds. */
export const FIRST_LIMIT_MS = 2000;
/** Time to answer the last prompt, in milliseconds. */
export const LAST_LIMIT_MS = 1000;
/** Swapped (orange) arrows only appear from this prompt index on. */
export const FIRST_SWAP_INDEX = 5;
/** Chance that a prompt from FIRST_SWAP_INDEX on asks for the opposite direction. */
export const SWAP_CHANCE = 0.4;
/** Share of the score given by right answers; the rest rewards speed. */
export const HIT_WEIGHT = 0.7;
/** Share of the score given by answering fast. */
export const SPEED_WEIGHT = 1 - HIT_WEIGHT;
