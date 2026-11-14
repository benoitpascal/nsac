import { MAX_SCORE } from '../../../core/minigame';
import type { ItemKind } from './item-kinds';
import type { Layout, PlacedItem } from './layout';
import type { MiniGameResult } from '../../../core/minigame';

/** A running search: the scene, the targets already found, and the time left (ms). */
export type Hunt = { layout: Layout; found: readonly ItemKind[]; remainingMs: number };

/** What a tap on an object did: found a target, hit a wrong object, or nothing. */
export type PickOutcome = 'found' | 'wrong' | 'none';

/** Time given to find every target, and time a hint costs (ms). */
export const HUNT_DURATION_MS = 90_000;
export const HINT_COST_MS = 10_000;
/** Share of the score granted by a win alone, and the most a loss can bring. */
const WIN_BASE_SHARE = 0.5;
const LOSS_MAX_SHARE = 0.5;

/** Starts searching the given scene with the full time. */
export const startHunt = (layout: Layout): Hunt => ({
  layout,
  found: [],
  remainingMs: HUNT_DURATION_MS,
});

/** Tells whether every target has been found. */
export const isWon = (hunt: Hunt) => hunt.found.length === hunt.layout.targets.length;

/** Tells whether the search is over, won or out of time. */
export const isOver = (hunt: Hunt) => isWon(hunt) || hunt.remainingMs <= 0;

/** Takes the tap on an object into account: a target not yet found gets collected. */
export const pickItem = (hunt: Hunt, item: PlacedItem): { hunt: Hunt; outcome: PickOutcome } => {
  if (isOver(hunt) || hunt.found.includes(item.kind)) return { hunt, outcome: 'none' };
  if (!hunt.layout.targets.includes(item.kind)) return { hunt, outcome: 'wrong' };
  return { hunt: { ...hunt, found: [...hunt.found, item.kind] }, outcome: 'found' };
};

/** Lets time run by the given duration (ms), never below zero. */
export const tickHunt = (hunt: Hunt, elapsedMs: number): Hunt => ({
  ...hunt,
  remainingMs: Math.max(0, hunt.remainingMs - elapsedMs),
});

/** Tells whether a hint can be bought without running out of time. */
export const canTakeHint = (hunt: Hunt) => !isOver(hunt) && hunt.remainingMs > HINT_COST_MS;

/**
 * Buys a hint: removes its cost from the time left and returns a target not yet found, or
 * leaves the search unchanged with no item when a hint cannot be bought.
 */
export const takeHint = (hunt: Hunt): { hunt: Hunt; item: PlacedItem | undefined } => {
  const item = hunt.layout.items.find(
    (candidate) =>
      hunt.layout.targets.includes(candidate.kind) && !hunt.found.includes(candidate.kind),
  );
  if (!canTakeHint(hunt) || !item) return { hunt, item: undefined };
  return { hunt: { ...hunt, remainingMs: hunt.remainingMs - HINT_COST_MS }, item };
};

/** Scores the search: a win from the time left, a loss from the targets found. */
export const huntResult = (hunt: Hunt): MiniGameResult => {
  const won = isWon(hunt);
  const share = won
    ? WIN_BASE_SHARE + (1 - WIN_BASE_SHARE) * (hunt.remainingMs / HUNT_DURATION_MS)
    : LOSS_MAX_SHARE * (hunt.found.length / hunt.layout.targets.length);
  return { won, score: Math.round(MAX_SCORE * share) };
};
