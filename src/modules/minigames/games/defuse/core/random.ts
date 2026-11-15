/** Returns a number from 0 (included) to 1 (excluded), like Math.random. */
export type Random = () => number;

/** Returns a whole number from 0 up to count (excluded). */
export const randomIndex = (random: Random, count: number) => Math.floor(random() * count);

/** Returns one of the items, picked at random. */
export const pickOne = <T>(random: Random, items: readonly T[]): T =>
  items[randomIndex(random, items.length)];

/** Returns a copy of the items in a random order. */
export const shuffle = <T>(random: Random, items: readonly T[]): T[] => {
  const mixed = [...items];
  for (let last = mixed.length - 1; last > 0; last -= 1) {
    const other = randomIndex(random, last + 1);
    [mixed[last], mixed[other]] = [mixed[other], mixed[last]];
  }
  return mixed;
};
