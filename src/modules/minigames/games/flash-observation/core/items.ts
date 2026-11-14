/** Every kind of space item a picture can show. */
export const ITEM_KINDS = ['planet', 'star', 'rocket', 'satellite', 'moon', 'comet'] as const;
/** A kind of space item. */
export type ItemKind = (typeof ITEM_KINDS)[number];

/** Every colour an item can have, chosen to stay apart for colour-blind players. */
export const ITEM_COLOURS = ['orange', 'blue', 'yellow', 'pink'] as const;
/** A colour of space item. */
export type ItemColour = (typeof ITEM_COLOURS)[number];

/** One item of the picture. */
export type Item = { kind: ItemKind; colour: ItemColour };

/** Counts the items of the picture matching the test. */
export const countItems = (picture: readonly Item[], matches: (item: Item) => boolean) =>
  picture.filter(matches).length;
