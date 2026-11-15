import { semiMajorAxisFromTurnsPerDay } from './orbits/earth-gravity';
import type { EarthOrbitElements } from './orbits/earth-orbit-elements';
import type { SatelliteId } from './spacecraft-ids';

/** CelesTrak general perturbations fields: epoch, turns/day, e, i, node, periapsis, anomaly. */
type GeneralPerturbations = [string, number, number, number, number, number, number];

// prettier-ignore
/** Orbits copied from CelesTrak general perturbations data on 14 November 2026. */
const GP: Record<SatelliteId, GeneralPerturbations> = {
  iss: ['2026-11-14T04:10:44Z', 15.49365732, 0.00073685, 51.6324, 277.8691, 23.754, 336.3788],
  hubble: ['2026-11-13T21:19:28Z', 15.32290088, 0.0002298, 28.4708, 136.2383, 24.6781, 335.3925],
  tiangong: ['2026-11-13T12:59:16Z', 15.61773849, 0.00043868, 41.4674, 134.3818, 302.2376, 57.8037],
  gps: ['2026-11-14T02:07:19Z', 2.0056713, 0.00416355, 55.785, 86.2766, 197.2709, 163.1731],
  galileo: ['2026-11-12T20:10:59Z', 1.70475824, 0.0002195, 56.9339, 337.723, 310.5422, 49.4796],
  'noaa-20': ['2026-11-14T06:38:53Z', 14.19537036, 0.00011802, 98.7927, 256.4869, 130.5819, 229.5459],
  'landsat-9': ['2026-11-14T04:06:42Z', 14.57112574, 0.00010431, 98.2127, 26.401, 88.5326, 271.5992],
  'sentinel-2a': ['2026-11-14T06:49:41Z', 14.30816282, 0.0001156, 98.5669, 30.9319, 95.7175, 264.414],
  terra: ['2026-11-14T06:19:55Z', 14.61197239, 0.00035485, 97.9264, 1.7139, 108.232, 317.4647],
  starlink: ['2026-11-14T05:02:59Z', 15.39745382, 0.00027335, 53.0538, 132.2305, 187.642, 172.4542],
};

/** Returns the orbit of the satellite, from its CelesTrak data. */
export const satelliteOrbit = (id: SatelliteId): EarthOrbitElements => {
  const [epoch, turnsPerDay, eccentricity, inclination, node, periapsis, anomaly] = GP[id];
  return {
    epoch: Date.parse(epoch),
    semiMajorAxisKm: semiMajorAxisFromTurnsPerDay(turnsPerDay),
    eccentricity,
    inclinationDegrees: inclination,
    ascendingNodeDegrees: node,
    periapsisArgumentDegrees: periapsis,
    meanAnomalyDegrees: anomaly,
  };
};
