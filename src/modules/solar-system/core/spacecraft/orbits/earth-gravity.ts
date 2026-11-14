const EARTH_MU_KM3_PER_S2 = 398_600.4418;
const FULL_TURN = Math.PI * 2;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_DAY = 86_400;

/** Returns the mean motion (radians per second) of an orbit with the given semi-major axis (km). */
export const meanMotion = (semiMajorAxisKm: number): number =>
  Math.sqrt(EARTH_MU_KM3_PER_S2 / semiMajorAxisKm ** 3);

/** Returns the time (hours) taken to go once around the Earth. */
export const orbitPeriodHours = (semiMajorAxisKm: number): number =>
  FULL_TURN / meanMotion(semiMajorAxisKm) / SECONDS_PER_HOUR;

/** Returns the speed (km/s) at the given distance (km) from the Earth's center (vis-viva). */
export const orbitSpeed = (semiMajorAxisKm: number, distanceKm: number): number =>
  Math.sqrt(EARTH_MU_KM3_PER_S2 * (2 / distanceKm - 1 / semiMajorAxisKm));

/** Returns the semi-major axis (km) of an orbit making the given number of turns per day. */
export const semiMajorAxisFromTurnsPerDay = (turnsPerDay: number): number =>
  Math.cbrt(EARTH_MU_KM3_PER_S2 / ((turnsPerDay * FULL_TURN) / SECONDS_PER_DAY) ** 2);
