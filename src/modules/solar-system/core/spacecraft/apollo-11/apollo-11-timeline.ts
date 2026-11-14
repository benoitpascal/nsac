import { EARTH_RADIUS_KM, geocentricMoonPosition } from '../../moon-orbit';
import { greenwichSiderealAngle } from '../orbits/sidereal-time';
import { orbitFromLaunch } from '../orbits/launched-orbit';
import { equatorialToEcliptic } from '../orbits/equatorial';
import { unit } from '../orbits/transfer-curve';
import type { Vector } from '../orbits/transfer-curve';

/** Apollo 11 key moments (UTC), from the NASA Apollo 11 Flight Journal. */
export const APOLLO_11 = {
  launch: Date.parse('1969-07-16T13:32Z'),
  towardsMoon: Date.parse('1969-07-16T16:22Z'),
  aroundMoon: Date.parse('1969-07-19T17:21Z'),
  towardsEarth: Date.parse('1969-07-22T04:55Z'),
  splashdown: Date.parse('1969-07-24T16:50Z'),
};

const CAPE_KENNEDY = { latitude: 28.61, longitude: -80.6 };
const SPLASHDOWN = { latitude: 13.3, longitude: -169.15 };
const PARKING_ORBIT = { perigeeKm: 190, apogeeKm: 190, inclination: 32.5 };
const LUNAR_ORBIT_PERIOD_MS = 2 * 3_600_000;
const FULL_TURN = Math.PI * 2;
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/** Waiting orbit around the Earth before leaving for the Moon. */
export const APOLLO_PARKING_ORBIT = orbitFromLaunch(PARKING_ORBIT, CAPE_KENNEDY, APOLLO_11.launch);

/** Height of the orbit around the Moon, over the Moon's radius. */
export const LUNAR_ORBIT_RADIUS_RATIO = (1737.4 + 110) / 1737.4;

/** Moon center (km from the Earth's center, J2000 ecliptic) at the given time. */
export const moonCenterKm = (timestamp: number): Vector => {
  const { x, y, z } = geocentricMoonPosition(timestamp);
  return { x: x * EARTH_RADIUS_KM, y: y * EARTH_RADIUS_KM, z: z * EARTH_RADIUS_KM };
};

/**
 * Direction from the Moon's center to the craft circling it, and the way it moves, in the
 * ecliptic plane; it arrives side-on, a quarter turn from the Earth direction.
 */
export const lunarOrbitAt = (timestamp: number): { out: Vector; along: Vector } => {
  const towardsEarth = unit({ ...moonCenterKm(APOLLO_11.aroundMoon), z: 0 });
  const start = Math.atan2(-towardsEarth.y, -towardsEarth.x) + Math.PI / 2;
  const angle = start + (FULL_TURN * (timestamp - APOLLO_11.aroundMoon)) / LUNAR_ORBIT_PERIOD_MS;
  return {
    out: { x: Math.cos(angle), y: Math.sin(angle), z: 0 },
    along: { x: -Math.sin(angle), y: Math.cos(angle), z: 0 },
  };
};

/** Direction from the Earth's center to the splashdown point, at splashdown time. */
export const splashdownDirection = (): Vector => {
  const latitude = toRadians(SPLASHDOWN.latitude);
  const longitude = greenwichSiderealAngle(APOLLO_11.splashdown) + toRadians(SPLASHDOWN.longitude);
  return equatorialToEcliptic({
    x: Math.cos(latitude) * Math.cos(longitude),
    y: Math.cos(latitude) * Math.sin(longitude),
    z: Math.sin(latitude),
  });
};
