import type { Spot } from '../obstacles';

/** A rectangle of ground seen from above (m). */
export type Footprint = { minX: number; maxX: number; minZ: number; maxZ: number };

/** How the round map is drawn: its size (px) and how many metres it shows from its center. */
export type MapFrame = { sizePx: number; rangeM: number };

/** A rectangle on the map (px), from its top-left corner. */
export type MapRect = { x: number; y: number; width: number; height: number };

/**
 * Pixels per metre on the map. The map stays centred on the walker with -z (the way the walker
 * faces at the start, towards the base) at the top.
 */
const scaleOf = ({ sizePx, rangeM }: MapFrame) => sizePx / 2 / rangeM;

/** Where a point of the ground lands on the map centred on the walker (px). */
export const toMap = (frame: MapFrame, center: Spot, spot: Spot): Spot => {
  const scale = scaleOf(frame);
  return {
    x: frame.sizePx / 2 + (spot.x - center.x) * scale,
    z: frame.sizePx / 2 + (spot.z - center.z) * scale,
  };
};

/** Where a footprint lands on the map, or undefined when it lies wholly outside the map. */
export const footprintOnMap = (
  frame: MapFrame,
  center: Spot,
  footprint: Footprint,
): MapRect | undefined => {
  const from = toMap(frame, center, { x: footprint.minX, z: footprint.minZ });
  const to = toMap(frame, center, { x: footprint.maxX, z: footprint.maxZ });
  if (to.x < 0 || to.z < 0 || from.x > frame.sizePx || from.z > frame.sizePx) return undefined;
  return { x: from.x, y: from.z, width: to.x - from.x, height: to.z - from.z };
};

/**
 * The turn (radians, clockwise from the top of the map) of the arrow showing where the walker
 * faces. A heading of 0 looks along -z, the top of the map, and grows turning left.
 */
export const arrowTurn = (heading: number): number => -heading;

/** How far the mission is (0 to 100 %, rounded down). */
export const progressPercent = (done: number, goal: number): number =>
  goal <= 0 ? 100 : Math.max(0, Math.min(100, Math.floor((done / goal) * 100)));
