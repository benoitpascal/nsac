import { meanMotion } from './earth-gravity';
import { equatorialToEcliptic } from './equatorial';
import type { EarthOrbitElements } from './earth-orbit-elements';
import type { EclipticPosition } from '../../orbit';

const EARTH_EQUATORIAL_RADIUS_KM = 6378.137;
const J2 = 1.08263e-3;
const MS_PER_SECOND = 1000;
const FULL_TURN = Math.PI * 2;
const KEPLER_ITERATIONS = 8;
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/** Node, periapsis and mean anomaly at the given time, drifting with the Earth's flattening. */
const anglesAt = (orbit: EarthOrbitElements, timestamp: number) => {
  const n = meanMotion(orbit.semiMajorAxisKm);
  const e2 = orbit.eccentricity ** 2;
  const flattening = J2 * (EARTH_EQUATORIAL_RADIUS_KM / (orbit.semiMajorAxisKm * (1 - e2))) ** 2;
  const cosI = Math.cos(toRadians(orbit.inclinationDegrees));
  const seconds = (timestamp - orbit.epoch) / MS_PER_SECOND;
  const drift = 0.75 * flattening * n * seconds;
  return {
    node: toRadians(orbit.ascendingNodeDegrees) - 2 * drift * cosI,
    periapsis: toRadians(orbit.periapsisArgumentDegrees) + drift * (5 * cosI ** 2 - 1),
    meanAnomaly:
      toRadians(orbit.meanAnomalyDegrees) +
      n * seconds +
      drift * Math.sqrt(1 - e2) * (3 * cosI ** 2 - 1),
  };
};

const solveKepler = (meanAnomaly: number, eccentricity: number) => {
  let eccentric = meanAnomaly;
  for (let step = 0; step < KEPLER_ITERATIONS; step++) {
    eccentric -=
      (eccentric - eccentricity * Math.sin(eccentric) - meanAnomaly) /
      (1 - eccentricity * Math.cos(eccentric));
  }
  return eccentric;
};

/** Position (km, J2000 ecliptic) on the orbit for the given eccentric anomaly and angles. */
const pointAt = (
  orbit: EarthOrbitElements,
  angles: { node: number; periapsis: number },
  eccentric: number,
): EclipticPosition => {
  const { semiMajorAxisKm: a, eccentricity: e } = orbit;
  const px = a * (Math.cos(eccentric) - e);
  const py = a * Math.sqrt(1 - e * e) * Math.sin(eccentric);
  const [cosW, sinW] = [Math.cos(angles.periapsis), Math.sin(angles.periapsis)];
  const [cosO, sinO] = [Math.cos(angles.node), Math.sin(angles.node)];
  const inclination = toRadians(orbit.inclinationDegrees);
  const [cosI, sinI] = [Math.cos(inclination), Math.sin(inclination)];
  const x = px * cosW - py * sinW;
  const y = px * sinW + py * cosW;
  return equatorialToEcliptic({
    x: x * cosO - y * cosI * sinO,
    y: x * sinO + y * cosI * cosO,
    z: y * sinI,
  });
};

/** Returns where the orbiting craft is at the given time (Unix ms), in km from the Earth's center. */
export const earthOrbitPosition = (orbit: EarthOrbitElements, timestamp: number) => {
  const angles = anglesAt(orbit, timestamp);
  return pointAt(orbit, angles, solveKepler(angles.meanAnomaly % FULL_TURN, orbit.eccentricity));
};

/** Returns evenly spread points (km) of the whole orbit as it is at the given time. */
export const earthOrbitPath = (orbit: EarthOrbitElements, timestamp: number, samples: number) => {
  const angles = anglesAt(orbit, timestamp);
  return Array.from({ length: samples }, (_, index) =>
    pointAt(orbit, angles, (index / samples) * FULL_TURN),
  );
};
