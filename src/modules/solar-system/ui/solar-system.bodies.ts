import { Vector3 } from 'three';
import { PLANET_ORBITS } from '../core/orbital-elements';
import { MOON, ORBITING_PLANETS, SUN } from '../core/solar-system-bodies';
import { createEclipseShadows } from './eclipse-shadows';
import { INITIAL_SCALE_MODE } from './nodes/display-scale';
import { createMoonNode } from './nodes/moon.node';
import { createPlanetNode } from './nodes/planet.node';
import { createSpacecraftLayer } from './spacecraft/spacecraft-layer';
import { createSunNode } from './nodes/sun.node';
import { flownMissions } from './spacecraft/missions/flown-missions';
import { createSolarSystemSpinners } from './solar-system.spinners';
import type { ScaleMode } from './nodes/display-scale';
import type { SolarSystemBodies } from './solar-system-bodies.type';
import type { FocusTarget } from './nodes/focus-target';
import type { Ephemeris } from '../core/spacecraft/ephemeris';
import type { WebGLRenderer } from 'three';
import { createBodyLoader } from '@/modules/globe/ui/bodies/body.catalog';

/**
 * Loads the Sun, the eight planets and the Moon around the Earth (not to scale), and the
 * missions with their given measured trajectories,
 * each placed where it is at the given time and spinning on itself, with satellites and missions.
 */
export const loadSolarSystemBodies = async (
  renderer: WebGLRenderer,
  timestamp: number,
  ephemerides: Promise<Ephemeris[]>,
): Promise<SolarSystemBodies> => {
  const earthSunDirection = new Vector3();
  const loadBody = createBodyLoader({ renderer, sunDirection: earthSunDirection });
  const [sunGlobe, moonGlobe, ...planetBodies] = await Promise.all(
    [SUN, MOON, ...ORBITING_PLANETS].map(loadBody),
  );
  const sun = createSunNode(SUN, sunGlobe, INITIAL_SCALE_MODE);
  const planets = ORBITING_PLANETS.map((planet, index) =>
    createPlanetNode(
      planet,
      planetBodies[index],
      PLANET_ORBITS[planet.id],
      INITIAL_SCALE_MODE,
      timestamp,
    ),
  );
  const earth = planets[ORBITING_PLANETS.findIndex((planet) => planet.id === 'earth')];
  const moon = createMoonNode(MOON, moonGlobe, INITIAL_SCALE_MODE, timestamp);
  earth.holder.add(moon.holder, moon.orbitLine);
  const spinners = createSolarSystemSpinners({
    sun: sunGlobe,
    moon: moonGlobe,
    planets: planetBodies,
    moonPosition: moon.holder.position,
    earthSunDirection,
  });
  const spacecraft = createSpacecraftLayer(
    earth.holder,
    INITIAL_SCALE_MODE,
    flownMissions(await ephemerides),
  );
  const bodyTargets = [sun, ...planets, moon].map((node) => node.focus);
  const focusTargets: FocusTarget[] = [...bodyTargets, ...spacecraft.targets];
  const updateEclipseShadows = createEclipseShadows(earth, moon);
  const placeAt = (at: number) => {
    for (const planet of planets) planet.moveTo(at);
    moon.moveTo(at);
    earthSunDirection.copy(earth.holder.position).negate().normalize();
    updateEclipseShadows(at);
  };
  const setScaleMode = (mode: ScaleMode) => {
    for (const node of [sun, ...planets, moon, spacecraft]) node.setScaleMode(mode);
  };
  return { sun, planets, spinners, spacecraft, focusTargets, placeAt, setScaleMode };
};
