import type { OrbitingPlanetId } from './orbital-elements';

/** The bodies shown with a size: the Sun, the eight planets and the Moon. */
export type SizedBodyId = OrbitingPlanetId | 'sun' | 'moon';

/** Mean (equatorial for the gas giants) radii, in km. */
export const REAL_RADIUS_KM: Record<SizedBodyId, number> = {
  sun: 696_000,
  mercury: 2439.7,
  venus: 6051.8,
  earth: 6371,
  moon: 1737.4,
  mars: 3389.5,
  jupiter: 69_911,
  saturn: 58_232,
  uranus: 25_362,
  neptune: 24_622,
};
