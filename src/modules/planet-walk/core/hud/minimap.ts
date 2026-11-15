import type { Spot } from '../obstacles';

/** A rectangle of ground seen from above (m). */
export type Footprint = { minX: number; maxX: number; minZ: number; maxZ: number };

/** How the round map is drawn: its size (px) and how many metres it shows from its center. */
export type MapFrame = { sizePx: number; rangeM: number };

/** Who the map follows: where they stand and where they face (radians, as the walker's heading). */
export type MapCenter = Spot & { heading: number };

/** A point on the map (px from its top-left corner). */
export type MapPoint = { x: number; y: number };

/**
 * Where a point of the ground lands on the round map. The map turns with the walker, as on the
 * Figma HUD: the walker stays in the middle and always faces the top of the map.
 */
export const toMap = (frame: MapFrame, center: MapCenter, spot: Spot): MapPoint => {
  const scale = frame.sizePx / 2 / frame.rangeM;
  const dx = spot.x - center.x;
  const dz = spot.z - center.z;
  // Seen from above with -z at the top, turned so that the walker's way ahead points up.
  const cos = Math.cos(center.heading);
  const sin = Math.sin(center.heading);
  return {
    x: frame.sizePx / 2 + (dx * cos - dz * sin) * scale,
    y: frame.sizePx / 2 + (dx * sin + dz * cos) * scale,
  };
};

/** The corners of a footprint on the map, or undefined when it lies wholly outside the map. */
export const footprintOnMap = (
  frame: MapFrame,
  center: MapCenter,
  footprint: Footprint,
): MapPoint[] | undefined => {
  const corners = [
    { x: footprint.minX, z: footprint.minZ },
    { x: footprint.maxX, z: footprint.minZ },
    { x: footprint.maxX, z: footprint.maxZ },
    { x: footprint.minX, z: footprint.maxZ },
  ].map((corner) => toMap(frame, center, corner));
  const outside = (pick: (point: MapPoint) => boolean) => corners.every(pick);
  const size = frame.sizePx;
  if (outside((p) => p.x < 0) || outside((p) => p.y < 0)) return undefined;
  if (outside((p) => p.x > size) || outside((p) => p.y > size)) return undefined;
  return corners;
};

/** The middle of a footprint (m). */
export const middleOf = (footprint: Footprint): Spot => ({
  x: (footprint.minX + footprint.maxX) / 2,
  z: (footprint.minZ + footprint.maxZ) / 2,
});
