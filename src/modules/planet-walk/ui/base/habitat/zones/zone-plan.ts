import type { HabitatBlock } from '../habitat-dimensions';

/** A piece of furniture or equipment of a zone, solid, possibly glowing (screens, lamps, grow lights). */
export type ZoneItem = { block: HabitatBlock; color: number; glow?: boolean };

/** What the action key says when going through a closed door, outwards and back towards the hall. */
export type DoorLabels = { outward: string; inward: string };

/**
 * A room of a wing: its sign, its length along the wing (m), its furniture (placed from the room's
 * center), and the closed door at its entrance, if any.
 */
export type ZonePlan = { name: string; length: number; items: ZoneItem[]; entryDoor?: DoorLabels };

/** A wing of the habitat: its name, its rooms from the central hall outwards, and its outer door, if any. */
export type WingPlan = { name: string; zones: ZonePlan[]; outerDoor?: DoorLabels };

/** A box given as [x, z, width, depth, bottom, top] (m, from the room's center, x across the wing). */
export type ItemBox = [number, number, number, number, number, number];

/** Returns a solid piece of furniture from its box and color. */
export const item = (box: ItemBox, color: number): ZoneItem => {
  const [x, z, width, depth, bottom, top] = box;
  return { block: { x, z, width, depth, bottom, top }, color };
};

/** Returns a glowing piece of furniture (screen, lamp, grow light) from its box and color. */
export const glowing = (box: ItemBox, color: number): ZoneItem => ({
  ...item(box, color),
  glow: true,
});

/** Colors shared by the rooms. */
export const ZONE_COLORS = {
  white: 0xeeeeea,
  metal: 0x9aa1ad,
  bench: 0xc8ccd2,
  dark: 0x2a2f38,
  wood: 0xb08850,
  blue: 0x4d6fa3,
  water: 0x3d7fd6,
  orange: 0xff6b3d,
  screen: 0x4de3ff,
  green: 0x3dff8a,
};
