import { APOLLO_11, lunarOrbitAt } from './apollo-11-timeline';
import { transferPoint, unit } from '../orbits/transfer-curve';
import type { Vector } from '../orbits/transfer-curve';

/**
 * Where the Apollo 11 path is drawn: in km, or in the scene with the Moon enlarged. Directions
 * given in the ecliptic frame are turned into the space's own axes.
 */
export type ApolloSpace = {
  parkingAt: (timestamp: number) => Vector;
  moonCenterAt: (timestamp: number) => Vector;
  lunarOrbitRadius: number;
  direction: (ecliptic: Vector) => Vector;
  splashdownPoint: Vector;
};

const TANGENT_STEP_MS = 10_000;

const lunarPoint = (space: ApolloSpace, timestamp: number) => {
  const { out } = lunarOrbitAt(timestamp);
  const center = space.moonCenterAt(timestamp);
  const offset = space.direction(out);
  const radius = space.lunarOrbitRadius;
  return {
    x: center.x + offset.x * radius,
    y: center.y + offset.y * radius,
    z: center.z + offset.z * radius,
  };
};

const leaving = (space: ApolloSpace) => {
  const start = space.parkingAt(APOLLO_11.towardsMoon);
  const next = space.parkingAt(APOLLO_11.towardsMoon + TANGENT_STEP_MS);
  return {
    start,
    direction: unit({ x: next.x - start.x, y: next.y - start.y, z: next.z - start.z }),
  };
};

const progress = (timestamp: number, from: number, to: number) => (timestamp - from) / (to - from);

/** Returns where Apollo 11 is at the given time in the given space, or nothing outside the flight. */
export const apolloPositionAt = (space: ApolloSpace, timestamp: number): Vector | undefined => {
  const { launch, towardsMoon, aroundMoon, towardsEarth, splashdown } = APOLLO_11;
  if (timestamp < launch || timestamp > splashdown) return undefined;
  if (timestamp < towardsMoon) return space.parkingAt(timestamp);
  if (timestamp < aroundMoon) {
    const { start, direction } = leaving(space);
    const arrival = space.direction(lunarOrbitAt(aroundMoon).along);
    const end = lunarPoint(space, aroundMoon);
    return transferPoint(
      start,
      direction,
      end,
      arrival,
      progress(timestamp, towardsMoon, aroundMoon),
    );
  }
  if (timestamp < towardsEarth) return lunarPoint(space, timestamp);
  const start = lunarPoint(space, towardsEarth);
  const departure = space.direction(lunarOrbitAt(towardsEarth).along);
  const end = space.splashdownPoint;
  const inwards = unit({ x: -end.x, y: -end.y, z: -end.z });
  return transferPoint(
    start,
    departure,
    end,
    inwards,
    progress(timestamp, towardsEarth, splashdown),
  );
};
