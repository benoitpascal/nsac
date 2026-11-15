import { centuriesSinceJ2000 } from './julian-time';
import { DISTANCE_TERMS, LATITUDE_TERMS, LONGITUDE_TERMS } from './lunar-terms';
import type { LunarTerm } from './lunar-terms';
import type { EclipticPosition } from './orbit';

type Angle = { atJ2000: number; perDay: number };

const DAYS_PER_CENTURY = 36_525;
const PRECESSION_DEGREES_PER_CENTURY = 1.3969713;
const MEAN_DISTANCE_KM = 385_000.56;
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const MEAN_LONGITUDE: Angle = { atJ2000: 218.3164477, perDay: 13.17639648 };
const FUNDAMENTAL_ANGLES: Angle[] = [
  { atJ2000: 297.8501921, perDay: 12.19074912 },
  { atJ2000: 357.5291092, perDay: 0.98560028 },
  { atJ2000: 134.9633964, perDay: 13.06499295 },
  { atJ2000: 93.272095, perDay: 13.22935024 },
];

/** Earth's mean radius in km, the unit of the Moon position. */
export const EARTH_RADIUS_KM = 6371;

const angleAt = (angle: Angle, days: number) => toRadians(angle.atJ2000 + angle.perDay * days);

const argumentOf = ([d, m, mPrime, f]: LunarTerm, angles: number[]) =>
  d * angles[0] + m * angles[1] + mPrime * angles[2] + f * angles[3];

const sumSines = (terms: LunarTerm[], angles: number[]) =>
  terms.reduce((sum, term) => sum + toRadians(term[4]) * Math.sin(argumentOf(term, angles)), 0);

const sumCosines = (terms: LunarTerm[], angles: number[]) =>
  terms.reduce((sum, term) => sum + term[4] * Math.cos(argumentOf(term, angles)), 0);

/**
 * Returns where the Moon is seen from the Earth's center at the given time (Unix timestamp in
 * ms), in Earth radii, in the J2000 ecliptic frame. Direction accurate to about 0.05°.
 */
export const geocentricMoonPosition = (timestamp: number): EclipticPosition => {
  const centuries = centuriesSinceJ2000(timestamp);
  const days = centuries * DAYS_PER_CENTURY;
  const angles = FUNDAMENTAL_ANGLES.map((angle) => angleAt(angle, days));
  const precession = toRadians(PRECESSION_DEGREES_PER_CENTURY * centuries);
  const longitude = angleAt(MEAN_LONGITUDE, days) + sumSines(LONGITUDE_TERMS, angles) - precession;
  const latitude = sumSines(LATITUDE_TERMS, angles);
  const distance = (MEAN_DISTANCE_KM + sumCosines(DISTANCE_TERMS, angles)) / EARTH_RADIUS_KM;
  return {
    x: distance * Math.cos(latitude) * Math.cos(longitude),
    y: distance * Math.cos(latitude) * Math.sin(longitude),
    z: distance * Math.sin(latitude),
  };
};
