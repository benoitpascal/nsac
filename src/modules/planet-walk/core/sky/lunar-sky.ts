import { LUNAR_SITE } from './lunar-site';
import { sunHeight } from '../station/local-time';

/** A unit direction in the walker's frame: y up, -z ahead at the start, x to the right. */
export type SkyDirection = { x: number; y: number; z: number };

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const LATITUDE = toRadians(LUNAR_SITE.latitudeDegrees);

/**
 * Turns a sky position given on the Moon's own equator (its hour angle from the local meridian,
 * positive towards the west, and its declination; radians) into a direction in the walker's frame:
 * x east, y up, -z north.
 */
const onSky = (hourAngle: number, declination: number): SkyDirection => {
  const east = -Math.cos(declination) * Math.sin(hourAngle);
  const up =
    Math.sin(LATITUDE) * Math.sin(declination) +
    Math.cos(LATITUDE) * Math.cos(declination) * Math.cos(hourAngle);
  const north =
    Math.cos(LATITUDE) * Math.sin(declination) -
    Math.sin(LATITUDE) * Math.cos(declination) * Math.cos(hourAngle);
  return { x: east, y: up, z: -north };
};

/**
 * The Earth never moves in the Moon's sky, since the Moon always shows it the same face: it stands
 * over the sub-Earth point (0° N, 0° E), so west of the base and high up.
 */
export const earthDirection = (): SkyDirection => onSky(toRadians(LUNAR_SITE.longitudeDegrees), 0);

/** Where the Moon's sky turns around: its north celestial pole, just above the north horizon. */
export const celestialNorth = (): SkyDirection => onSky(0, Math.PI / 2);

/**
 * Where the Sun stands at that point of the base's local day (0 at midnight, 0.5 at noon): it
 * rises in the east, passes almost overhead at noon and sets in the west, over a 29.5-day day.
 * Its yearly swing of ±1.5° north and south is left out.
 */
export const sunDirection = (dayShare: number): SkyDirection =>
  onSky((dayShare - 0.5) * 2 * Math.PI, 0);

const J2000_MS = Date.UTC(2000, 0, 1, 12);
const MS_PER_DAY = 86_400_000;

/**
 * Where the Sun stands among the stars at that time (Unix ms): its mean ecliptic longitude
 * (radians), accurate to about 2°, enough to set the stars behind it.
 */
export const sunEclipticLongitude = (timestamp: number): number => {
  const days = (timestamp - J2000_MS) / MS_PER_DAY;
  return toRadians((280.46 + 0.9856474 * days) % 360);
};

/** How much sunlight reaches the ground, from 0 (night) to 1 (noon), as the solar panels see it. */
export const daylight = (dayShare: number): number => sunHeight(dayShare);

/**
 * How much of the Earth's face we see lit, from 0 (new Earth, at full Moon) to 1 (full Earth, at
 * new Moon), from the Moon's cycle of phases (0 new Moon, 0.5 full Moon): its light, the
 * earthshine, is what lights the ground during the lunar night.
 */
export const earthFullness = (lunationShare: number): number =>
  (1 + Math.cos(lunationShare * 2 * Math.PI)) / 2;
