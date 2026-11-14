export type GlobeRotation = {
  surface: number;
  cloudsOffset: number;
};

export type Direction = {
  x: number;
  y: number;
  z: number;
};

const FULL_TURN = Math.PI * 2;
const SURFACE_SPEED = 0.06;
const CLOUDS_DRIFT = 0.002;
const GREENWICH_FACING_VIEWER = -Math.PI / 2;
const EUROPE_AFRICA_OFFSET = -0.35;

/** Normalized direction pointing from the globe towards the sun. */
export const SUN_DIRECTION: Direction = (() => {
  const raw = { x: -1, y: 0.3, z: 0.7 };
  const length = Math.hypot(raw.x, raw.y, raw.z);
  return { x: raw.x / length, y: raw.y / length, z: raw.z / length };
})();

/** Starting orientation, with Europe and Africa facing the viewer. */
export const INITIAL_ROTATION: GlobeRotation = {
  surface: GREENWICH_FACING_VIEWER + EUROPE_AFRICA_OFFSET,
  cloudsOffset: 0,
};

/**
 * Returns the globe rotation after the given elapsed time.
 * Clouds drift slowly relative to the surface, as a texture offset wrapping in [0, 1).
 */
export const advanceRotation = (
  rotation: GlobeRotation,
  elapsedSeconds: number,
): GlobeRotation => ({
  surface: (rotation.surface + SURFACE_SPEED * elapsedSeconds) % FULL_TURN,
  cloudsOffset: (rotation.cloudsOffset + CLOUDS_DRIFT * elapsedSeconds) % 1,
});
