/** Every kind of object that can lie around the workshop. */
export const ITEM_KINDS = [
  'wrench',
  'helmet',
  'battery',
  'screwdriver',
  'keyCard',
  'flashlight',
  'plant',
  'cup',
  'glove',
  'bolt',
  'antenna',
  'magnet',
  'hammer',
  'gear',
  'tape',
  'bulb',
] as const;

/** One kind of object of the workshop. */
export type ItemKind = (typeof ITEM_KINDS)[number];

/** Returns a number in [0, 1), like Math.random, so a layout can be replayed. */
export type Random = () => number;

/** Returns a copy of the list in a random order (Fisher-Yates). */
export const shuffle = <T>(list: readonly T[], random: Random): T[] => {
  const copy = [...list];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [copy[index], copy[other]] = [copy[other], copy[index]];
  }
  return copy;
};
