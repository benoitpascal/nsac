import { MAX_SCORE } from '../../../core/minigame';

/** Number of signal lights on the station panel. */
export const LIGHT_COUNT = 4;
/** Length of the sequence the player must repeat to win. */
export const WIN_LENGTH = 8;

/** The sequence of lights to repeat, and how many of them the player has already repeated. */
export type Memory = { sequence: readonly number[]; entered: number };

/** What a press leads to: keep going, round repeated, game won, or a wrong light. */
export type PressOutcome = 'next' | 'round' | 'won' | 'mistake';

const randomLight = (random: () => number) =>
  Math.min(LIGHT_COUNT - 1, Math.floor(random() * LIGHT_COUNT));

/** Starts with a sequence of one random light. */
export const startMemory = (random: () => number): Memory => ({
  sequence: [randomLight(random)],
  entered: 0,
});

/** Adds one random light at the end of the sequence and resets what the player entered. */
export const growMemory = (memory: Memory, random: () => number): Memory => ({
  sequence: [...memory.sequence, randomLight(random)],
  entered: 0,
});

const outcomeAfter = (memory: Memory): PressOutcome => {
  if (memory.entered < memory.sequence.length) return 'next';
  return memory.sequence.length >= WIN_LENGTH ? 'won' : 'round';
};

/** Checks a pressed light against the sequence and returns the memory after it with the outcome. */
export const pressLight = (
  memory: Memory,
  light: number,
): { memory: Memory; outcome: PressOutcome } => {
  if (memory.sequence[memory.entered] !== light) return { memory, outcome: 'mistake' };
  const next = { ...memory, entered: memory.entered + 1 };
  return { memory: next, outcome: outcomeAfter(next) };
};

/**
 * Score of a finished game: full when won, otherwise proportional to the longest sequence
 * repeated, which is the current one minus the light that was missed.
 */
export const memoryScore = (memory: Memory, won: boolean) => {
  if (won) return MAX_SCORE;
  const longest = memory.sequence.length - 1;
  return Math.round((longest / WIN_LENGTH) * MAX_SCORE);
};
