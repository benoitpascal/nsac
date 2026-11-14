import { orbitPeriodHours, orbitSpeed } from '../spacecraft/orbits/earth-gravity';
import { EARTH_RADIUS_KM } from '../moon-orbit';
import { earthOrbitPosition } from '../spacecraft/orbits/earth-orbit';
import type { Satellite } from '../spacecraft/satellites';

/** What the facts sheet says about a satellite at a given time. */
export type SatelliteFacts = {
  role: string;
  launch: number;
  altitudeKm: number;
  speedKmPerS: number;
  periodHours: number;
};

/** Returns the facts about the satellite at the given time (Unix ms). */
export const satelliteFacts = (satellite: Satellite, timestamp: number): SatelliteFacts => {
  const { x, y, z } = earthOrbitPosition(satellite.orbit, timestamp);
  const distanceKm = Math.hypot(x, y, z);
  return {
    role: satellite.role,
    launch: satellite.launch,
    altitudeKm: distanceKm - EARTH_RADIUS_KM,
    speedKmPerS: orbitSpeed(satellite.orbit.semiMajorAxisKm, distanceKm),
    periodHours: orbitPeriodHours(satellite.orbit.semiMajorAxisKm),
  };
};
