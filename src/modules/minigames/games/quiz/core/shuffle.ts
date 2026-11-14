/** Returns a number in [0, 1), like Math.random. */
export type Random = () => number;

/** Returns a copy of the items in a random order (Fisher–Yates). */
export const shuffle = <T>(items: readonly T[], random: Random): T[] => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [copy[index], copy[other]] = [copy[other], copy[index]];
  }
  return copy;
};
