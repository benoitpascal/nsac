import { MOON, ORBITING_PLANETS } from '../core/solar-system-bodies';
import { createEarthSpinner, createFreeSpinner, createMoonSpinner } from './body-spin';
import type { Spinner } from './body-spin';
import type { Body } from '@/modules/globe/ui/bodies/body';
import type { Vector3 } from 'three';

export type SpinningBodies = {
  sun: Body;
  moon: Body;
  /** Planet models, in the order of the orbiting planets. */
  planets: Body[];
  /** Position of the Moon relative to the Earth. */
  moonPosition: Vector3;
  /** Direction from the Earth towards the Sun. */
  earthSunDirection: Vector3;
};

/**
 * Spins the Sun and the planets at their real speeds, the Earth facing the Sun at the right
 * time of day, and the Moon always facing the Earth.
 */
export const createSolarSystemSpinners = (bodies: SpinningBodies): Spinner[] => [
  createFreeSpinner(bodies.sun, 'sun'),
  createMoonSpinner(bodies.moon, MOON.axialTilt, () => bodies.moonPosition.clone().negate()),
  ...ORBITING_PLANETS.map((planet, index) =>
    planet.id === 'earth'
      ? createEarthSpinner(bodies.planets[index], planet.axialTilt, bodies.earthSunDirection)
      : createFreeSpinner(bodies.planets[index], planet.id),
  ),
];
