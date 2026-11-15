import { darkBoard, litCount, pressLight } from './board';
import type { Board } from './board';

/** Gives a number in [0, 1), like Math.random. */
export type Random = () => number;

/** A level: its starting panel and how many random presses built it. */
export type Level = { start: Board; presses: number };

/** Panel sizes of the three levels, from easy to hard. */
export const LEVEL_SIZES = [3, 4, 5] as const;
/** A level starts with at least this many lights on. */
const MIN_LIT = 3;
/** Extra random presses on top of the panel size. */
const EXTRA_PRESSES = 1;
/** Draws stop after this many tries, keeping the last panel. */
const MAX_TRIES = 50;

const pickCells = (count: number, cells: number, random: Random) => {
  const pool = Array.from({ length: cells }, (_, index) => index);
  const picked: number[] = [];
  while (picked.length < count && pool.length > 0) {
    picked.push(...pool.splice(Math.floor(random() * pool.length), 1));
  }
  return picked;
};

const drawLevel = (size: number, random: Random): Level => {
  const presses = size + EXTRA_PRESSES;
  const cells = pickCells(presses, size * size, random);
  return { start: cells.reduce(pressLight, darkBoard(size)), presses };
};

/**
 * Builds a level by pressing distinct random lights of a dark panel, so it can always be
 * switched off again; draws again until enough lights are on.
 */
export const generateLevel = (size: number, random: Random): Level => {
  let level = drawLevel(size, random);
  for (let tries = 1; tries < MAX_TRIES && litCount(level.start) < MIN_LIT; tries += 1) {
    level = drawLevel(size, random);
  }
  return level;
};
