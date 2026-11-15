import { ITEM_KINDS, shuffle } from './item-kinds';
import type { ItemKind, Random } from './item-kinds';

/** An object lying in the scene: center, size and turn (degrees), in scene units. */
export type PlacedItem = {
  id: number;
  kind: ItemKind;
  x: number;
  y: number;
  size: number;
  rotation: number;
};

/** The objects of the scene, back to front, and the kinds the player must find. */
export type Layout = { items: readonly PlacedItem[]; targets: readonly ItemKind[] };

type Spot = { x: number; y: number };

/** Width and height of the scene, in scene units. */
export const SCENE_WIDTH = 400;
export const SCENE_HEIGHT = 240;
/** How many objects the player must find. */
export const TARGET_COUNT = 5;
const ITEM_COUNT = 25;
const EDGE_MARGIN = 16;
const MIN_SIZE = 18;
const MAX_SIZE = 30;
const FULL_TURN_DEG = 360;
/** Least distance between two targets, and between a target and any other object. */
const TARGET_GAP = 40;
const DECOY_GAP = 16;
const MAX_TRIES = 60;

const between = (random: Random, min: number, max: number) => min + random() * (max - min);

const randomSpot = (random: Random): Spot => ({
  x: between(random, EDGE_MARGIN, SCENE_WIDTH - EDGE_MARGIN),
  y: between(random, EDGE_MARGIN, SCENE_HEIGHT - EDGE_MARGIN),
});

const isFarFrom = (spot: Spot, others: readonly Spot[], gap: number) =>
  others.every((other) => Math.hypot(other.x - spot.x, other.y - spot.y) >= gap);

const findSpot = (random: Random, others: readonly Spot[], gap: number) => {
  let spot = randomSpot(random);
  for (let tries = 1; tries < MAX_TRIES && !isFarFrom(spot, others, gap); tries += 1) {
    spot = randomSpot(random);
  }
  return spot;
};

/**
 * Builds a new messy workshop: five target kinds, each present once and kept apart from the
 * others, among decoys of the other kinds, all with random sizes, turns and stacking order.
 */
export const generateLayout = (random: Random): Layout => {
  const kinds = shuffle(ITEM_KINDS, random);
  const targets = kinds.slice(0, TARGET_COUNT);
  const decoyKinds = kinds.slice(TARGET_COUNT);
  const targetSpots = targets.reduce<Spot[]>(
    (spots) => [...spots, findSpot(random, spots, TARGET_GAP)],
    [],
  );
  const decoys = Array.from({ length: ITEM_COUNT - TARGET_COUNT }, (_, index) => ({
    kind: decoyKinds[index % decoyKinds.length],
    ...findSpot(random, targetSpots, DECOY_GAP),
  }));
  const all = [...targets.map((kind, index) => ({ kind, ...targetSpots[index] })), ...decoys];
  const items = shuffle(all, random).map((item, id) => ({
    ...item,
    id,
    size: between(random, MIN_SIZE, MAX_SIZE),
    rotation: between(random, 0, FULL_TURN_DEG),
  }));
  return { items, targets };
};
