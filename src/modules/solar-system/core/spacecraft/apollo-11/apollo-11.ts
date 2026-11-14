import { EARTH_RADIUS_KM } from '../../moon-orbit';
import { apolloPathAt } from './apollo-11-drawn-path';
import { apolloPositionAt } from './apollo-11-path';
import {
  APOLLO_PARKING_ORBIT,
  LUNAR_ORBIT_RADIUS_RATIO,
  moonCenterKm,
  splashdownDirection,
} from './apollo-11-timeline';
import { earthOrbitPosition } from '../orbits/earth-orbit';
import type { ApolloSpace } from './apollo-11-path';
import type { MissionTrajectory } from '../mission-trajectory';

const MOON_RADIUS_KM = 1737.4;

const KM_SPACE: ApolloSpace = {
  parkingAt: (timestamp) => earthOrbitPosition(APOLLO_PARKING_ORBIT, timestamp),
  moonCenterAt: moonCenterKm,
  lunarOrbitRadius: MOON_RADIUS_KM * LUNAR_ORBIT_RADIUS_RATIO,
  direction: (ecliptic) => ecliptic,
  splashdownPoint: (() => {
    const { x, y, z } = splashdownDirection();
    return { x: x * EARTH_RADIUS_KM, y: y * EARTH_RADIUS_KM, z: z * EARTH_RADIUS_KM };
  })(),
};

/**
 * Apollo 11, drawn from its timeline: a waiting orbit around the Earth, the trip to the Moon,
 * 30 turns around the Moon, and the trip back to the Pacific Ocean. Not a measured path.
 * The drawn path shows one turn around the Moon, where the Moon is at the shown time.
 */
export const apolloTrajectory = (): MissionTrajectory => {
  return {
    positionAt: (timestamp) => apolloPositionAt(KM_SPACE, timestamp),
    pathAt: (timestamp) => apolloPathAt(KM_SPACE, timestamp),
    pathChanges: true,
  };
};
