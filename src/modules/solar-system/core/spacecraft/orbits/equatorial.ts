import type { EclipticPosition } from '../../orbit';

const OBLIQUITY = (23.4392911 * Math.PI) / 180;
const COS_OBLIQUITY = Math.cos(OBLIQUITY);
const SIN_OBLIQUITY = Math.sin(OBLIQUITY);

/** Turns a J2000 equatorial vector into the J2000 ecliptic frame used by the scene. */
export const equatorialToEcliptic = ({ x, y, z }: EclipticPosition): EclipticPosition => ({
  x,
  y: y * COS_OBLIQUITY + z * SIN_OBLIQUITY,
  z: -y * SIN_OBLIQUITY + z * COS_OBLIQUITY,
});
