import { ANALYTIC_TRAJECTORIES } from '../../../core/spacecraft/analytic-trajectories';
import { ephemerisTrajectory } from '../../../core/spacecraft/ephemeris';
import { MISSIONS } from '../../../core/spacecraft/missions';
import { apolloDisplay } from './apollo-11.display';
import { ephemerisDisplay } from './ephemeris.display';
import type { DisplayTrajectory } from './mission-display';
import type { FlownMission } from '../spacecraft-layer';
import type { Mission } from '../../../core/spacecraft/missions';
import type { Ephemeris } from '../../../core/spacecraft/ephemeris';
import type { MissionId } from '../../../core/spacecraft/spacecraft-ids';

/** Missions drawn relative to the shown bodies rather than on their frame's usual scale. */
const CUSTOM_DISPLAYS: Partial<Record<MissionId, () => DisplayTrajectory>> = {
  'apollo-11': apolloDisplay,
};

const measured = (mission: Mission, ephemeris: Ephemeris): FlownMission => {
  const trajectory = ephemerisTrajectory(mission, ephemeris);
  return { mission, trajectory, display: ephemerisDisplay(ephemeris, trajectory) };
};

/**
 * Returns the missions whose trajectory can be shown: computed ones, and measured ones among
 * the given ephemerides.
 */
export const flownMissions = (ephemerides: Ephemeris[]): FlownMission[] =>
  MISSIONS.flatMap((mission) => {
    const ephemeris = ephemerides.find((candidate) => candidate.missionId === mission.id);
    if (ephemeris) return [measured(mission, ephemeris)];
    const build = ANALYTIC_TRAJECTORIES[mission.id];
    return build
      ? [{ mission, trajectory: build(mission), display: CUSTOM_DISPLAYS[mission.id]?.() }]
      : [];
  });
