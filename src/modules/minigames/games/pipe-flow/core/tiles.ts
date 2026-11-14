/** A side of a cell: 0 up, 1 right, 2 down, 3 left (clockwise). */
export type Side = 0 | 1 | 2 | 3;

/** The shapes of pipe a tile can hold; `empty` is bare ground with no pipe. */
export type TileKind = 'straight' | 'corner' | 'tee' | 'cross' | 'empty';

/** A tile and how many quarter turns clockwise it has been rotated (0 to 3). */
export type Tile = { kind: TileKind; turns: number };

/** Number of sides of a square cell, and of quarter turns in a full turn. */
export const SIDES = 4;

/** Open sides of each shape before any rotation. */
export const BASE_OPENINGS: Record<TileKind, readonly Side[]> = {
  straight: [0, 2],
  corner: [0, 1],
  tee: [0, 1, 2],
  cross: [0, 1, 2, 3],
  empty: [],
};

const toSide = (value: number): Side => (((value % SIDES) + SIDES) % SIDES) as Side;

/** Returns the side facing the given one. */
export const oppositeOf = (side: Side): Side => toSide(side + SIDES / 2);

/** Returns the sides a tile opens on, once rotated. */
export const openingsOf = (tile: Tile): Side[] =>
  BASE_OPENINGS[tile.kind].map((side) => toSide(side + tile.turns));

/** Returns the tile turned one quarter clockwise. */
export const rotateTile = (tile: Tile): Tile => ({ ...tile, turns: toSide(tile.turns + 1) });

const sameSides = (left: readonly Side[], right: readonly Side[]) =>
  left.length === right.length && left.every((side) => right.includes(side));

/**
 * Returns the fewest clockwise quarter turns that make the tile open exactly on the wanted
 * sides, or undefined when no rotation of its shape can.
 */
export const turnsToMatch = (tile: Tile, wanted: readonly Side[]): number | undefined => {
  for (let extra = 0; extra < SIDES; extra += 1) {
    const turned = { ...tile, turns: toSide(tile.turns + extra) };
    if (sameSides(openingsOf(turned), wanted)) return extra;
  }
  return undefined;
};
