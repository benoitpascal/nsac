import { centuriesSinceJ2000 } from './julian-time';
import type { KeplerElements, PlanetOrbit } from './orbital-elements';

/** Length of the astronomical unit, in km. */
export const KM_PER_AU = 149_597_870.7;

/** Heliocentric ecliptic coordinates, in astronomical units. */
export type EclipticPosition = {
  x: number;
  y: number;
  z: number;
};

const KEPLER_ITERATIONS = 8;
const FULL_TURN = Math.PI * 2;
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const elementsAt = ({ atJ2000, perCentury }: PlanetOrbit, timestamp: number): KeplerElements => {
  const centuries = centuriesSinceJ2000(timestamp);
  const drift = (key: keyof KeplerElements) => atJ2000[key] + perCentury[key] * centuries;
  return {
    semiMajorAxis: drift('semiMajorAxis'),
    eccentricity: drift('eccentricity'),
    inclination: drift('inclination'),
    meanLongitude: drift('meanLongitude'),
    perihelionLongitude: drift('perihelionLongitude'),
    ascendingNodeLongitude: drift('ascendingNodeLongitude'),
  };
};

const solveEccentricAnomaly = (meanAnomaly: number, eccentricity: number) => {
  let anomaly = meanAnomaly;
  for (let step = 0; step < KEPLER_ITERATIONS; step++) {
    const error = anomaly - eccentricity * Math.sin(anomaly) - meanAnomaly;
    anomaly -= error / (1 - eccentricity * Math.cos(anomaly));
  }
  return anomaly;
};

const positionOnOrbit = (elements: KeplerElements, eccentricAnomaly: number): EclipticPosition => {
  const { semiMajorAxis: a, eccentricity: e } = elements;
  const inPlaneX = a * (Math.cos(eccentricAnomaly) - e);
  const inPlaneY = a * Math.sqrt(1 - e * e) * Math.sin(eccentricAnomaly);
  const node = toRadians(elements.ascendingNodeLongitude);
  const perihelion = toRadians(elements.perihelionLongitude) - node;
  const inclination = toRadians(elements.inclination);
  const [cosW, sinW, cosN, sinN] = [
    Math.cos(perihelion),
    Math.sin(perihelion),
    Math.cos(node),
    Math.sin(node),
  ];
  const cosI = Math.cos(inclination);
  return {
    x:
      (cosW * cosN - sinW * sinN * cosI) * inPlaneX +
      (-sinW * cosN - cosW * sinN * cosI) * inPlaneY,
    y:
      (cosW * sinN + sinW * cosN * cosI) * inPlaneX +
      (-sinW * sinN + cosW * cosN * cosI) * inPlaneY,
    z: Math.sin(inclination) * (sinW * inPlaneX + cosW * inPlaneY),
  };
};

/** Returns where the planet is around the Sun at the given time (Unix timestamp in ms). */
export const heliocentricPosition = (orbit: PlanetOrbit, timestamp: number): EclipticPosition => {
  const elements = elementsAt(orbit, timestamp);
  const meanAnomaly = toRadians(elements.meanLongitude - elements.perihelionLongitude) % FULL_TURN;
  return positionOnOrbit(elements, solveEccentricAnomaly(meanAnomaly, elements.eccentricity));
};

/** Returns evenly spread points along the whole orbit, as it is shaped at the given time. */
export const orbitPath = (
  orbit: PlanetOrbit,
  timestamp: number,
  samples: number,
): EclipticPosition[] => {
  const elements = elementsAt(orbit, timestamp);
  return Array.from({ length: samples }, (_, index) =>
    positionOnOrbit(elements, (index / samples) * FULL_TURN),
  );
};
