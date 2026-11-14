import { ITEM_COLOURS, ITEM_KINDS } from './items';
import { pickOne, sample, shuffle } from './random';
import type { Item, ItemColour, ItemKind } from './items';
import type { Random } from './random';

/** How busy a picture is: how many items, of how many kinds and colours. */
export type PictureLevel = { items: number; kinds: number; colours: number };

/**
 * A picture with the kind that shows exactly once (its single item) and the kinds left out.
 */
export type Picture = {
  items: Item[];
  single: Item;
  missing: ItemKind[];
  colours: ItemColour[];
};

/**
 * Draws a picture for the level: one kind shows exactly once, every other chosen kind at least
 * once, and the remaining kinds are missing.
 */
export const drawPicture = (random: Random, level: PictureLevel): Picture => {
  const kinds = sample(random, ITEM_KINDS, level.kinds);
  const colours = sample(random, ITEM_COLOURS, level.colours);
  const [singleKind, ...repeated] = kinds;
  if (singleKind === undefined || repeated.length === 0) throw new Error('Too few kinds');
  const single: Item = { kind: singleKind, colour: pickOne(random, colours) };
  const fillers = Array.from({ length: level.items - kinds.length }, () =>
    pickOne(random, repeated),
  );
  const others = [...repeated, ...fillers].map((kind) => ({
    kind,
    colour: pickOne(random, colours),
  }));
  return {
    items: shuffle(random, [single, ...others]),
    single,
    missing: ITEM_KINDS.filter((kind) => !kinds.includes(kind)),
    colours,
  };
};
