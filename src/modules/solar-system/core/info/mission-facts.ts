import { EARTH_RADIUS_KM } from '../moon-orbit';
import { heliocentricPosition, KM_PER_AU } from '../orbit';
import { PLANET_ORBITS } from '../orbital-elements';
import type { Mission } from '../spacecraft/missions';
import type { MissionTrajectory } from '../spacecraft/mission-trajectory';
import type { EclipticPosition } from '../orbit';

/** What the facts sheet says about a mission at a given time. */
export type MissionFacts = {
  summary: string;
  destination: string;
  launch: number;
  daysFlown: number;
  /** Height above the ground, for craft around the Earth. */
  altitudeKm?: number;
  distanceFromEarthKm: number;
  distanceFromSunKm?: number;
  speedKmPerS: number;
};

const SPEED_HALF_STEP_MS = 60_000;
const MS_PER_DAY = 86_400_000;
const MS_PER_SECOND = 1000;
const NEAR_EARTH_KM = 100_000;

const length = ({ x, y, z }: EclipticPosition) => Math.hypot(x, y, z);
const minus = (a: EclipticPosition, b: EclipticPosition) => ({
  x: a.x - b.x,
  y: a.y - b.y,
  z: a.z - b.z,
});

const earthFromSunKm = (timestamp: number) => {
  const { x, y, z } = heliocentricPosition(PLANET_ORBITS.earth, timestamp);
  return { x: x * KM_PER_AU, y: y * KM_PER_AU, z: z * KM_PER_AU };
};

/** Speed from the positions just before and after, or on one side only at either end. */
const speedAt = (trajectory: MissionTrajectory, timestamp: number, position: EclipticPosition) => {
  const beforeAt = timestamp - SPEED_HALF_STEP_MS;
  const afterAt = timestamp + SPEED_HALF_STEP_MS;
  const before = trajectory.positionAt(beforeAt);
  const after = trajectory.positionAt(afterAt);
  const seconds = ((after ? afterAt : timestamp) - (before ? beforeAt : timestamp)) / MS_PER_SECOND;
  return seconds > 0 ? length(minus(after ?? position, before ?? position)) / seconds : 0;
};

/** Returns the facts about the mission at the given time, or nothing when it is not flying. */
export const missionFacts = (
  mission: Mission,
  trajectory: MissionTrajectory,
  timestamp: number,
): MissionFacts | undefined => {
  const position = trajectory.positionAt(timestamp);
  if (!position) return undefined;
  const fromEarth =
    mission.frame === 'earth'
      ? length(position)
      : length(minus(position, earthFromSunKm(timestamp)));
  return {
    summary: mission.summary,
    destination: mission.destination,
    launch: mission.window.start,
    daysFlown: (timestamp - mission.window.start) / MS_PER_DAY,
    altitudeKm: fromEarth < NEAR_EARTH_KM ? fromEarth - EARTH_RADIUS_KM : undefined,
    distanceFromEarthKm: fromEarth,
    distanceFromSunKm: mission.frame === 'sun' ? length(position) : undefined,
    speedKmPerS: speedAt(trajectory, timestamp, position),
  };
};
