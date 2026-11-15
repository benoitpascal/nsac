import { KM_PER_AU } from '../../../core/orbit';
import { toScenePosition } from '../../../core/scene-scale';
import { ephemerisSamples } from '../../../core/spacecraft/ephemeris';
import { geocentricSceneOffset } from '../../nodes/geocentric-scale';
import { placeNearPlanets } from './planet-close-up';
import type { ScaleMode } from '../../nodes/display-scale';
import type { DisplayTrajectory } from './mission-display';
import type { EclipticPosition } from '../../../core/orbit';
import type { Ephemeris } from '../../../core/spacecraft/ephemeris';
import type { MissionTrajectory } from '../../../core/spacecraft/mission-trajectory';

const placeFromSun = (km: EclipticPosition, timestamp: number, mode: ScaleMode) => {
  const scene = toScenePosition({ x: km.x / KM_PER_AU, y: km.y / KM_PER_AU, z: km.z / KM_PER_AU });
  return mode === 'easy' ? placeNearPlanets(scene, timestamp) : scene;
};

/**
 * Places a measured trajectory in the scene: around the Earth on the geocentric scale, or in the
 * solar system to scale, flying around the enlarged planets in easy view.
 */
export const ephemerisDisplay = (
  ephemeris: Ephemeris,
  trajectory: MissionTrajectory,
): DisplayTrajectory => {
  const place = (km: EclipticPosition, timestamp: number, mode: ScaleMode) =>
    ephemeris.center === 'earth'
      ? geocentricSceneOffset(km, mode)
      : placeFromSun(km, timestamp, mode);
  const samples = ephemerisSamples(ephemeris);
  return {
    positionAt: (timestamp, mode) => {
      const position = trajectory.positionAt(timestamp);
      return position && place(position, timestamp, mode);
    },
    pathAt: (_, mode) => samples.map(({ time, position }) => place(position, time, mode)),
    pathChanges: false,
  };
};
