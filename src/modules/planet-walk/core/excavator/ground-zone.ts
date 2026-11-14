import type { Spot } from '../obstacles';

/** A rectangle of ground (m), such as where regolith is dug or dropped off. */
export type GroundZone = { minX: number; maxX: number; minZ: number; maxZ: number };

/** Whether the spot lies in the zone. */
export const insideZone = (zone: GroundZone, spot: Spot): boolean =>
  spot.x >= zone.minX && spot.x <= zone.maxX && spot.z >= zone.minZ && spot.z <= zone.maxZ;

/** Returns the zone moved so that its origin stands at the given spot. */
export const zoneAround = (zone: GroundZone, origin: Spot): GroundZone => ({
  minX: origin.x + zone.minX,
  maxX: origin.x + zone.maxX,
  minZ: origin.z + zone.minZ,
  maxZ: origin.z + zone.maxZ,
});
