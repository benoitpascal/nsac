import { BufferGeometry, Group, LineBasicMaterial, LineLoop, Vector3 } from 'three';
import { heliocentricPosition, orbitPath } from '../../core/orbit';
import { toScenePosition } from '../../core/scene-scale';
import { createSizedBody } from './sized-body';
import type { ScaleMode } from './display-scale';
import type { SizedBody } from './sized-body';
import type { Body } from '@/modules/globe/ui/bodies/body';
import type { CelestialBody } from '@/modules/globe/core/bodies';
import type { OrbitingPlanetId, PlanetOrbit } from '../../core/orbital-elements';

export type PlanetNode = SizedBody & {
  holder: Group;
  orbitLine: LineLoop;
  moveTo: (timestamp: number) => void;
};

const ORBIT_SAMPLES = 256;
const ORBIT_COLOR = 0x4de3ff;
const ORBIT_OPACITY = 0.28;

const toVector = (position: { x: number; y: number; z: number }) =>
  new Vector3(position.x, position.y, position.z);

const createOrbitLine = (orbit: PlanetOrbit, timestamp: number) => {
  const points = orbitPath(orbit, timestamp, ORBIT_SAMPLES).map((point) =>
    toVector(toScenePosition(point)),
  );
  const material = new LineBasicMaterial({
    color: ORBIT_COLOR,
    transparent: true,
    opacity: ORBIT_OPACITY,
  });
  return new LineLoop(new BufferGeometry().setFromPoints(points), material);
};

/**
 * Places a planet body, sized for the given scale, with its clickable name and its to-scale orbit
 * path. The planet is moved along its orbit to where it is at the given time.
 */
export const createPlanetNode = (
  planet: CelestialBody & { id: OrbitingPlanetId },
  body: Body,
  orbit: PlanetOrbit,
  mode: ScaleMode,
  timestamp: number,
): PlanetNode => {
  const holder = new Group();
  const sized = createSizedBody(planet, body, holder, mode);
  const moveTo = (at: number) => {
    holder.position.copy(toVector(toScenePosition(heliocentricPosition(orbit, at))));
  };
  moveTo(timestamp);
  return { holder, orbitLine: createOrbitLine(orbit, timestamp), moveTo, ...sized };
};
