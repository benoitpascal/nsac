import { KM_PER_AU } from '../../../core/orbit';
import { toScenePosition } from '../../../core/scene-scale';
import { geocentricSceneOffset } from '../../nodes/geocentric-scale';
import type { ScaleMode } from '../../nodes/display-scale';
import type { Mission } from '../../../core/spacecraft/missions';
import type { MissionTrajectory } from '../../../core/spacecraft/mission-trajectory';
import type { EclipticPosition } from '../../../core/orbit';
import type { ScenePosition } from '../../../core/scene-scale';

/** A mission's trajectory placed in the scene, relative to the center of its frame. */
export type DisplayTrajectory = {
  positionAt: (timestamp: number, mode: ScaleMode) => ScenePosition | undefined;
  pathAt: (timestamp: number, mode: ScaleMode) => ScenePosition[];
  pathChanges: boolean;
};

const toAu = ({ x, y, z }: EclipticPosition) => ({
  x: x / KM_PER_AU,
  y: y / KM_PER_AU,
  z: z / KM_PER_AU,
});

/**
 * Places a trajectory in the scene: around the Earth on the geocentric scale, or in the
 * solar system to scale, like the planets.
 */
export const displayTrajectory = (
  mission: Mission,
  trajectory: MissionTrajectory,
): DisplayTrajectory => {
  const place = (position: EclipticPosition, mode: ScaleMode) =>
    mission.frame === 'earth'
      ? geocentricSceneOffset(position, mode)
      : toScenePosition(toAu(position));
  return {
    positionAt: (timestamp, mode) => {
      const position = trajectory.positionAt(timestamp);
      return position && place(position, mode);
    },
    pathAt: (timestamp, mode) => trajectory.pathAt(timestamp).map((point) => place(point, mode)),
    pathChanges: trajectory.pathChanges,
  };
};
