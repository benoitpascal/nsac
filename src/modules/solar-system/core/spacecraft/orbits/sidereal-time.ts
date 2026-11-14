const MS_PER_DAY = 86_400_000;
const UNIX_EPOCH_JULIAN_DAY = 2_440_587.5;
const J2000_JULIAN_DAY = 2_451_545;
const GMST_AT_J2000_DEGREES = 280.46061837;
const GMST_DEGREES_PER_DAY = 360.98564736629;

/**
 * Returns the Greenwich mean sidereal time (radians) at the given time (Unix ms): the angle
 * between the vernal equinox and the Greenwich meridian.
 */
export const greenwichSiderealAngle = (timestamp: number): number => {
  const days = timestamp / MS_PER_DAY + UNIX_EPOCH_JULIAN_DAY - J2000_JULIAN_DAY;
  const degrees = (GMST_AT_J2000_DEGREES + GMST_DEGREES_PER_DAY * days) % 360;
  return (degrees * Math.PI) / 180;
};
