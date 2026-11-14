import { PLANET_ORBITS } from './orbital-elements';
import type { CelestialBody, CelestialBodyId } from '@/modules/globe/core/bodies';
import type { OrbitingPlanetId } from './orbital-elements';
import { PLANETS } from '@/modules/globe/core/catalogs';

export type OrbitingPlanet = CelestialBody & { id: OrbitingPlanetId };

const isOrbitingPlanet = (body: CelestialBody): body is OrbitingPlanet => body.id in PLANET_ORBITS;

const findBody = <Id extends CelestialBodyId>(id: Id) => {
  const body = PLANETS.bodies.find(
    (candidate): candidate is CelestialBody & { id: Id } => candidate.id === id,
  );
  if (!body) throw new Error(`Missing ${id} in the planet catalog`);
  return body;
};

/** The Sun, from the planet catalog. */
export const SUN = findBody('sun');

/** The Moon, from the planet catalog. */
export const MOON = findBody('moon');

/** The eight planets orbiting the Sun, ordered outwards. */
export const ORBITING_PLANETS: readonly OrbitingPlanet[] = PLANETS.bodies.filter(isOrbitingPlanet);
