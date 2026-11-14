import { generateLevel } from './level';
import { disorderOf, isSorted, pour } from './tubes';
import type { RandomSource } from './level';
import type { Rack } from './tubes';

/** Number of colors in each level, from first to last. */
export const LEVEL_COLORS = [3, 4, 5] as const;

/**
 * A level being played: its starting rack, the racks before each move (for undo), the current
 * rack, the tube picked to pour from, and the move count expected from a good player.
 */
export type SortLevel = {
  index: number;
  start: Rack;
  history: readonly Rack[];
  rack: Rack;
  selected: number | undefined;
  targetMoves: number;
};

/** Creates the level at the given index, freshly shuffled. */
export const createLevel = (index: number, random: RandomSource): SortLevel => {
  const colors = LEVEL_COLORS[index] ?? LEVEL_COLORS[0];
  const start = generateLevel(colors, random);
  const targetMoves = disorderOf(start) + colors;
  return { index, start, history: [], rack: start, selected: undefined, targetMoves };
};

/** Moves made so far in the level. */
export const movesOf = (level: SortLevel) => level.history.length;

/** Tells whether the level is solved. */
export const isLevelSolved = (level: SortLevel) => isSorted(level.rack);

/** Tells whether the level is the last one. */
export const isLastLevel = (level: SortLevel) => level.index >= LEVEL_COLORS.length - 1;

/**
 * Handles a tap on a tube: picks it when none is picked (and it is not empty), drops the pick when
 * tapped again, or pours into it; a pour that is not allowed picks the tapped tube instead.
 */
export const tapTube = (level: SortLevel, tube: number): SortLevel => {
  const { rack, selected } = level;
  if (tube < 0 || tube >= rack.length) return level;
  if (selected === undefined || selected === tube) {
    const canPick = selected === undefined && (rack[tube]?.length ?? 0) > 0;
    return { ...level, selected: canPick ? tube : undefined };
  }
  const poured = pour(rack, selected, tube);
  if (poured === rack)
    return { ...level, selected: (rack[tube]?.length ?? 0) > 0 ? tube : undefined };
  return { ...level, history: [...level.history, rack], rack: poured, selected: undefined };
};

/** Takes back the last move. */
export const undoMove = (level: SortLevel): SortLevel => {
  const previous = level.history[level.history.length - 1];
  if (previous === undefined) return { ...level, selected: undefined };
  return { ...level, history: level.history.slice(0, -1), rack: previous, selected: undefined };
};

/** Puts the level back as it started. */
export const restartLevel = (level: SortLevel): SortLevel => ({
  ...level,
  history: [],
  rack: level.start,
  selected: undefined,
});
