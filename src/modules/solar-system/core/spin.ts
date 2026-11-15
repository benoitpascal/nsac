import type { OrbitingPlanetId } from './orbital-elements';

export type SpinningBodyId = OrbitingPlanetId | 'sun';

const FULL_TURN = Math.PI * 2;
const MS_PER_HOUR = 3_600_000;
const HOURS_PER_DAY = 24;
const NOON_HOUR = 12;
const MIN_BLURRED_TURNS = 0.25;

/** Sidereal rotation periods in hours; negative for a retrograde spin. */
const SIDEREAL_ROTATION_HOURS: Record<SpinningBodyId, number> = {
  sun: 609.12,
  mercury: 1407.6,
  venus: -5832.5,
  earth: 23.9345,
  mars: 24.6229,
  jupiter: 9.925,
  saturn: 10.656,
  uranus: -17.24,
  neptune: 16.11,
};

/** Returns the sidereal rotation period of the body in hours, negative for a retrograde spin. */
export const siderealRotationHours = (id: SpinningBodyId): number => SIDEREAL_ROTATION_HOURS[id];

/** Ecliptic longitude towards which the Earth's north pole leans. */
export const EARTH_POLE_ECLIPTIC_LONGITUDE = Math.PI / 2;

/**
 * Returns the angle (radians) the body has turned on itself at the given time
 * (Unix timestamp in ms), at its real sidereal speed.
 */
export const spinAngleAt = (id: SpinningBodyId, timestamp: number): number => {
  const turns = timestamp / MS_PER_HOUR / SIDEREAL_ROTATION_HOURS[id];
  return (turns % 1) * FULL_TURN;
};

/**
 * Returns the fraction of a turn (up to a full turn) over which the body's surface is smeared
 * when it turns too fast to follow during the given simulated time, and 0 otherwise.
 */
export const spinBlurDuring = (id: SpinningBodyId, simulatedMs: number): number => {
  const turns = Math.abs(simulatedMs / MS_PER_HOUR / SIDEREAL_ROTATION_HOURS[id]);
  return turns < MIN_BLURRED_TURNS ? 0 : Math.min(turns, 1);
};

/**
 * Returns the longitude (radians, east positive) where the Sun is overhead on the Earth
 * at the given time (Unix timestamp in ms), from the mean solar time.
 */
export const subsolarLongitude = (timestamp: number): number => {
  const hoursOfDay = (timestamp / MS_PER_HOUR) % HOURS_PER_DAY;
  return ((NOON_HOUR - hoursOfDay) / HOURS_PER_DAY) * FULL_TURN;
};
