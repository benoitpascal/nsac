import { REAL_RADIUS_KM } from '../body-radii';
import { EARTH_RADIUS_KM, geocentricMoonPosition } from '../moon-orbit';
import { heliocentricPosition, KM_PER_AU } from '../orbit';
import { PLANET_ORBITS } from '../orbital-elements';
import { siderealRotationHours } from '../spin';
import type { SizedBodyId } from '../body-radii';
import type { EclipticPosition } from '../orbit';

/** What a body goes around, and in how many days. */
export type BodyOrbit = { around: 'sun' | 'earth'; days: number };

/** Facts about a body at a given time; a distance is missing for the body it is measured from. */
export type BodyFacts = {
  radiusKm: number;
  radiusInEarths: number;
  /** Sidereal rotation period, negative for a body spinning backwards. */
  dayHours: number;
  orbit?: BodyOrbit;
  distanceFromSunKm?: number;
  distanceFromEarthKm?: number;
};

const DAYS_PER_CENTURY = 36_525;
const DEGREES_PER_TURN = 360;
const MOON_SIDEREAL_MONTH_DAYS = 27.321661;
const HOURS_PER_DAY = 24;

const distanceKm = (a: EclipticPosition, b: EclipticPosition) =>
  Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) * KM_PER_AU;

const SUN_POSITION: EclipticPosition = { x: 0, y: 0, z: 0 };

const heliocentricAt = (id: SizedBodyId, timestamp: number): EclipticPosition => {
  if (id === 'sun') return SUN_POSITION;
  const earth = heliocentricPosition(PLANET_ORBITS.earth, timestamp);
  if (id !== 'moon') return heliocentricPosition(PLANET_ORBITS[id], timestamp);
  const moon = geocentricMoonPosition(timestamp);
  const auPerEarthRadius = EARTH_RADIUS_KM / KM_PER_AU;
  return {
    x: earth.x + moon.x * auPerEarthRadius,
    y: earth.y + moon.y * auPerEarthRadius,
    z: earth.z + moon.z * auPerEarthRadius,
  };
};

const orbitOf = (id: SizedBodyId): BodyOrbit | undefined => {
  if (id === 'sun') return undefined;
  if (id === 'moon') return { around: 'earth', days: MOON_SIDEREAL_MONTH_DAYS };
  const degreesPerCentury = PLANET_ORBITS[id].perCentury.meanLongitude;
  return { around: 'sun', days: (DEGREES_PER_TURN * DAYS_PER_CENTURY) / degreesPerCentury };
};

/** Returns the size, day, year and current distances of a body at the given time (Unix ms). */
export const bodyFacts = (id: SizedBodyId, timestamp: number): BodyFacts => {
  const position = heliocentricAt(id, timestamp);
  const earth = heliocentricAt('earth', timestamp);
  return {
    radiusKm: REAL_RADIUS_KM[id],
    radiusInEarths: REAL_RADIUS_KM[id] / REAL_RADIUS_KM.earth,
    dayHours: id === 'moon' ? MOON_SIDEREAL_MONTH_DAYS * HOURS_PER_DAY : siderealRotationHours(id),
    orbit: orbitOf(id),
    distanceFromSunKm: id === 'sun' ? undefined : distanceKm(position, SUN_POSITION),
    distanceFromEarthKm: id === 'earth' ? undefined : distanceKm(position, earth),
  };
};
