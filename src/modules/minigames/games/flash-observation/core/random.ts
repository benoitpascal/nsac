/** Returns a number in [0, 1), like Math.random; injected so games can be replayed in tests. */
export type Random = () => number;

/** Picks one entry of a non-empty list. */
export const pickOne = <T>(random: Random, list: readonly T[]): T => {
  const entry = list[Math.floor(random() * list.length)];
  if (entry === undefined) throw new Error('Cannot pick from an empty list');
  return entry;
};

/** Returns a shuffled copy of the list. */
export const shuffle = <T>(random: Random, list: readonly T[]): T[] => {
  const copy = [...list];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [copy[index], copy[other]] = [copy[other], copy[index]];
  }
  return copy;
};

/** Returns the given number of distinct entries of the list, in random order. */
export const sample = <T>(random: Random, list: readonly T[], count: number): T[] =>
  shuffle(random, list).slice(0, count);
