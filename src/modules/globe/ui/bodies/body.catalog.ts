import { createEarthBody } from './earth.body';
import { EQUIPMENT_FACTORIES } from './equipment/equipment.body';
import { SATELLITE_FACTORIES } from './satellite/satellite.body';
import { createSaturnBody } from './saturn.body';
import { createSunBody } from './sun.body';
import { createTexturedSphereBody } from './textured-sphere.body';
import type { CelestialBody, CelestialBodyId } from '../../core/bodies';
import type { Body, BodyContext, BodyFactory } from './body';

const ROCKY_RELIEF = 2;
const SMOOTH_RELIEF = 0;

const texturedSphere =
  (textureUrl: string, reliefScale: number): BodyFactory =>
  (context, axialTilt) =>
    createTexturedSphereBody({ textureUrl, reliefScale }, context, axialTilt);

const FACTORIES: Record<CelestialBodyId, BodyFactory> = {
  sun: createSunBody,
  mercury: texturedSphere('/textures/mercury/mercury_4096.jpg', ROCKY_RELIEF),
  venus: texturedSphere('/textures/venus/venus_4096.jpg', SMOOTH_RELIEF),
  earth: createEarthBody,
  moon: texturedSphere('/textures/moon/moon_4096.jpg', ROCKY_RELIEF),
  mars: texturedSphere('/textures/mars/mars_4096.jpg', ROCKY_RELIEF),
  jupiter: texturedSphere('/textures/jupiter/jupiter_4096.jpg', SMOOTH_RELIEF),
  saturn: createSaturnBody,
  uranus: texturedSphere('/textures/uranus/uranus_2048.jpg', SMOOTH_RELIEF),
  neptune: texturedSphere('/textures/neptune/neptune_2048.jpg', SMOOTH_RELIEF),
  ...SATELLITE_FACTORIES,
  ...EQUIPMENT_FACTORIES,
};

/**
 * Returns a factory loading each body once, then reusing it on later requests.
 */
export const createBodyLoader = (context: BodyContext) => {
  const loaded = new Map<CelestialBodyId, Promise<Body>>();
  return (body: CelestialBody): Promise<Body> => {
    const cached = loaded.get(body.id);
    if (cached) return cached;
    const loading = FACTORIES[body.id](context, body.axialTilt);
    loaded.set(body.id, loading);
    return loading;
  };
};
