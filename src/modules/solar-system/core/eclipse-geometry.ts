import { EARTH_RADIUS_KM, geocentricMoonPosition } from './moon-orbit';
import { heliocentricPosition, KM_PER_AU } from './orbit';
import { PLANET_ORBITS } from './orbital-elements';
import type { EclipticPosition } from './orbit';

/**
 * The Sun and a body that may hide it, seen from a receiving body. The Sun, too far for its
 * direction to change across the receiver, is given as a unit direction and an angular radius
 * (radians); the occluder position is relative to the receiver's center, in receiver radii.
 */
export type ShadowCasting = {
  sunDirection: EclipticPosition;
  sunAngularRadius: number;
  occluder: EclipticPosition;
  occluderRadius: number;
};

const SUN_RADIUS_KM = 696_000;
const MOON_RADIUS_KM = 1737.4;
const EARTH_SHADOW_ENLARGEMENT = 1.02;

const scale = ({ x, y, z }: EclipticPosition, factor: number): EclipticPosition => ({
  x: x * factor,
  y: y * factor,
  z: z * factor,
});

const length = ({ x, y, z }: EclipticPosition) => Math.hypot(x, y, z);

const sunSeenFrom = (sunOffset: EclipticPosition) => ({
  sunDirection: scale(sunOffset, 1 / length(sunOffset)),
  sunAngularRadius: Math.asin(SUN_RADIUS_KM / (length(sunOffset) * EARTH_RADIUS_KM)),
});

const subtract = (a: EclipticPosition, b: EclipticPosition): EclipticPosition => ({
  x: a.x - b.x,
  y: a.y - b.y,
  z: a.z - b.z,
});

/**
 * Returns the real Sun–Earth–Moon geometry at the given time (Unix timestamp in ms):
 * the Moon possibly hiding the Sun from the Earth (solar eclipse), and the Earth, its shadow
 * slightly enlarged by its atmosphere, possibly hiding the Sun from the Moon (lunar eclipse).
 */
export const eclipseGeometry = (timestamp: number) => {
  const earthFromSun = heliocentricPosition(PLANET_ORBITS.earth, timestamp);
  const sunFromEarth = scale(earthFromSun, -KM_PER_AU / EARTH_RADIUS_KM);
  const moonFromEarth = geocentricMoonPosition(timestamp);
  const moonRadius = MOON_RADIUS_KM / EARTH_RADIUS_KM;
  const onEarth: ShadowCasting = {
    ...sunSeenFrom(sunFromEarth),
    occluder: moonFromEarth,
    occluderRadius: moonRadius,
  };
  const onMoon: ShadowCasting = {
    ...sunSeenFrom(subtract(sunFromEarth, moonFromEarth)),
    occluder: scale(moonFromEarth, -1 / moonRadius),
    occluderRadius: EARTH_SHADOW_ENLARGEMENT / moonRadius,
  };
  return { onEarth, onMoon };
};
