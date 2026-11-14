import type { EclipticPosition } from './orbit';

/** A star of the catalog, with its J2000 equatorial coordinates. */
export type Star = {
  rightAscensionHours: number;
  declinationDegrees: number;
  magnitude: number;
  /** B−V color index: negative for blue stars, around 0.65 for the Sun, above 1.5 for red ones. */
  colorIndex: number;
};

const J2000_OBLIQUITY = (23.4392911 * Math.PI) / 180;
const RADIANS_PER_HOUR = Math.PI / 12;
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/**
 * Returns the unit direction of the star in the J2000 ecliptic frame, the frame the planets
 * are placed in, so the sky lines up with the Sun's path through the zodiac.
 */
export const starDirection = (star: Star): EclipticPosition => {
  const rightAscension = star.rightAscensionHours * RADIANS_PER_HOUR;
  const declination = toRadians(star.declinationDegrees);
  const x = Math.cos(declination) * Math.cos(rightAscension);
  const y = Math.cos(declination) * Math.sin(rightAscension);
  const z = Math.sin(declination);
  const [cos, sin] = [Math.cos(J2000_OBLIQUITY), Math.sin(J2000_OBLIQUITY)];
  return { x, y: y * cos + z * sin, z: -y * sin + z * cos };
};
