import { sunHeight } from '../station/local-time';

/** A unit direction in the walker's frame: y up, -z ahead at the start, x to the right. */
export type SkyDirection = { x: number; y: number; z: number };

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/**
 * The base stands near the Moon's south pole, where Artemis plans to land. There the Moon's axis
 * points almost at the south pole of the ecliptic (1.5° away), so the Sun and the Earth both stay
 * low over the horizon, and the starry sky turns once around the zenith every lunar day.
 */
export const SOUTH_POLE_SITE = {
  /**
   * Highest the Sun climbs at local noon (degrees). Real value: about 1.5°. Raised for the game so
   * that the ground stays readable (see DATA.md).
   */
  sunPeakDegrees: 10,
  /** How high the Earth hangs (degrees): it wobbles between about -7° and +7°, kept here at +6°. */
  earthElevationDegrees: 6,
  /** Which way the Earth hangs, from the walker's starting heading (degrees, to the right). */
  earthAzimuthDegrees: 20,
} as const;

const fromAngles = (azimuth: number, elevation: number): SkyDirection => ({
  x: Math.sin(azimuth) * Math.cos(elevation),
  y: Math.sin(elevation),
  z: -Math.cos(azimuth) * Math.cos(elevation),
});

/** The Earth never moves in the Moon's sky, since the Moon always shows it the same face. */
export const earthDirection = (): SkyDirection =>
  fromAngles(
    toRadians(SOUTH_POLE_SITE.earthAzimuthDegrees),
    toRadians(SOUTH_POLE_SITE.earthElevationDegrees),
  );

/**
 * How far (radians) the Sun and the stars have turned around the zenith at that point of the
 * local day (0 at midnight, 0.5 at noon): at noon the Sun stands right above the Earth, and the
 * Earth shows us its night side (a "new Earth"); at midnight the Earth is full.
 */
export const skyTurn = (dayShare: number): number =>
  toRadians(SOUTH_POLE_SITE.earthAzimuthDegrees) + (dayShare - 0.5) * 2 * Math.PI;

/**
 * Where the Sun stands at that point of the local day: circling the horizon once per lunar day,
 * above it during the 14-day day and below it during the 14-day night.
 */
export const sunDirection = (dayShare: number): SkyDirection => {
  const peak = toRadians(SOUTH_POLE_SITE.sunPeakDegrees);
  const rise = Math.sin((dayShare - 0.25) * 2 * Math.PI);
  return fromAngles(skyTurn(dayShare), peak * rise);
};

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
 * How much of the Earth's face we see lit, from 0 (new Earth, at noon) to 1 (full Earth, at
 * midnight): its light, the earthshine, is what lights the ground during the lunar night.
 */
export const earthFullness = (dayShare: number): number =>
  (1 + Math.cos(dayShare * 2 * Math.PI)) / 2;
