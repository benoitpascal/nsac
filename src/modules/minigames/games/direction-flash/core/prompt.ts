import { DIRECTIONS, oppositeOf } from './directions';
import {
  FIRST_LIMIT_MS,
  FIRST_SWAP_INDEX,
  LAST_LIMIT_MS,
  PROMPT_COUNT,
  SWAP_CHANCE,
} from './rules';
import type { Direction } from './directions';

/** Returns a number in [0, 1), like Math.random. */
export type Random = () => number;

/**
 * A direction shown by the co-pilot: when swapped, the player must answer the opposite one.
 * limitMs is the time allowed to answer.
 */
export type Prompt = { direction: Direction; swapped: boolean; limitMs: number };

/** How an answer went: right and in time or not, and how fast (1 instant, 0 at the limit). */
export type Answer = { hit: boolean; speed: number };

/** A prompt left without answer until its limit. */
export const MISSED: Answer = { hit: false, speed: 0 };

/** Time allowed for the prompt at this index, shrinking evenly from the first to the last. */
export const timeLimitAt = (index: number) =>
  FIRST_LIMIT_MS - ((FIRST_LIMIT_MS - LAST_LIMIT_MS) * index) / (PROMPT_COUNT - 1);

/** Draws the prompt at this index; swapped prompts only come after the first ones. */
export const createPrompt = (index: number, random: Random): Prompt => ({
  direction: DIRECTIONS[Math.floor(random() * DIRECTIONS.length)],
  swapped: index >= FIRST_SWAP_INDEX && random() < SWAP_CHANCE,
  limitMs: timeLimitAt(index),
});

/** The direction the player must press for this prompt. */
export const expectedDirection = (prompt: Prompt): Direction =>
  prompt.swapped ? oppositeOf(prompt.direction) : prompt.direction;

/** Judges the direction pressed after elapsedMs: right only when expected and within the limit. */
export const judgeAnswer = (prompt: Prompt, direction: Direction, elapsedMs: number): Answer => {
  const hit = direction === expectedDirection(prompt) && elapsedMs <= prompt.limitMs;
  return hit ? { hit, speed: 1 - elapsedMs / prompt.limitMs } : MISSED;
};
