import { apolloTrajectory } from './apollo-11/apollo-11';
import { sputnikTrajectory, vostokTrajectory } from './historic-orbits';
import type { Mission } from './missions';
import type { MissionTrajectory } from './mission-trajectory';
import type { MissionId } from './spacecraft-ids';

/** Missions whose trajectory is computed from published orbits or a timeline. */
export const ANALYTIC_TRAJECTORIES: Partial<
  Record<MissionId, (mission: Mission) => MissionTrajectory>
> = {
  'sputnik-1': sputnikTrajectory,
  'vostok-1': vostokTrajectory,
  'apollo-11': apolloTrajectory,
};
