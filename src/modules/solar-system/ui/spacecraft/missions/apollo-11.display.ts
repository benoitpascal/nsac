import { geocentricMoonPosition } from '../../../core/moon-orbit';
import { toSceneAxes, toSceneOffset } from '../../../core/scene-scale';
import { apolloPathAt } from '../../../core/spacecraft/apollo-11/apollo-11-drawn-path';
import { apolloPositionAt } from '../../../core/spacecraft/apollo-11/apollo-11-path';
import {
  APOLLO_PARKING_ORBIT,
  LUNAR_ORBIT_RADIUS_RATIO,
  splashdownDirection,
} from '../../../core/spacecraft/apollo-11/apollo-11-timeline';
import { earthOrbitPosition } from '../../../core/spacecraft/orbits/earth-orbit';
import { displayRadius } from '../../nodes/display-scale';
import { geocentricSceneOffset, moonSceneOffset } from '../../nodes/geocentric-scale';
import type { ScaleMode } from '../../nodes/display-scale';
import type { DisplayTrajectory } from './mission-display';
import type { ApolloSpace } from '../../../core/spacecraft/apollo-11/apollo-11-path';

const sceneSpace = (mode: ScaleMode): ApolloSpace => ({
  parkingAt: (timestamp) =>
    geocentricSceneOffset(earthOrbitPosition(APOLLO_PARKING_ORBIT, timestamp), mode),
  moonCenterAt: (timestamp) => moonSceneOffset(geocentricMoonPosition(timestamp), mode),
  lunarOrbitRadius: displayRadius('moon', mode) * LUNAR_ORBIT_RADIUS_RATIO,
  direction: toSceneAxes,
  splashdownPoint: toSceneOffset(splashdownDirection(), displayRadius('earth', mode)),
});

/**
 * Places Apollo 11 around the shown Earth and Moon: the turns around the Moon hug the Moon as
 * it is drawn, enlarged or not, and the trips join them.
 */
export const apolloDisplay = (): DisplayTrajectory => {
  const spaces: Record<ScaleMode, ApolloSpace> = {
    easy: sceneSpace('easy'),
    real: sceneSpace('real'),
  };
  return {
    positionAt: (timestamp, mode) => apolloPositionAt(spaces[mode], timestamp),
    pathAt: (timestamp, mode) => apolloPathAt(spaces[mode], timestamp),
    pathChanges: true,
  };
};
