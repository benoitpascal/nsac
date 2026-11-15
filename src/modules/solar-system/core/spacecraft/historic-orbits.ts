import { orbitPeriodHours } from './orbits/earth-gravity';
import { earthOrbitPath, earthOrbitPosition } from './orbits/earth-orbit';
import { BAIKONUR, orbitFromLaunch } from './orbits/launched-orbit';
import type { Mission } from './missions';
import type { MissionTrajectory } from './mission-trajectory';

const PATH_SAMPLES = 128;
const MS_PER_HOUR = 3_600_000;

const isFlying = (mission: Mission, timestamp: number) =>
  timestamp >= mission.window.start && timestamp <= mission.window.end;

/** Sputnik 1: 215 × 939 km, 65.1°, launched from Baikonur; its whole orbit is drawn. */
export const sputnikTrajectory = (mission: Mission): MissionTrajectory => {
  const shape = { perigeeKm: 215, apogeeKm: 939, inclination: 65.1 };
  const orbit = orbitFromLaunch(shape, BAIKONUR, mission.window.start);
  return {
    positionAt: (timestamp) =>
      isFlying(mission, timestamp) ? earthOrbitPosition(orbit, timestamp) : undefined,
    pathAt: (timestamp) => earthOrbitPath(orbit, timestamp, PATH_SAMPLES),
    pathChanges: true,
  };
};

/**
 * Vostok 1: 169 × 327 km, 64.95°, launched from Baikonur. Only its single turn around the
 * Earth is drawn; the craft waits at its end until the landing time.
 */
export const vostokTrajectory = (mission: Mission): MissionTrajectory => {
  const shape = { perigeeKm: 169, apogeeKm: 327, inclination: 64.95 };
  const launch = mission.window.start;
  const orbit = orbitFromLaunch(shape, BAIKONUR, launch);
  const turnEnd = launch + orbitPeriodHours(orbit.semiMajorAxisKm) * MS_PER_HOUR;
  const path = Array.from({ length: PATH_SAMPLES + 1 }, (_, index) =>
    earthOrbitPosition(orbit, launch + ((turnEnd - launch) * index) / PATH_SAMPLES),
  );
  return {
    positionAt: (timestamp) =>
      isFlying(mission, timestamp)
        ? earthOrbitPosition(orbit, Math.min(timestamp, turnEnd))
        : undefined,
    pathAt: () => path,
    pathChanges: false,
  };
};
