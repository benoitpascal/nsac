import { apolloPositionAt } from './apollo-11-path';
import { APOLLO_11 } from './apollo-11-timeline';
import type { ApolloSpace } from './apollo-11-path';
import type { Vector } from '../orbits/transfer-curve';

const PARKING_SAMPLES = 120;
const TRANSFER_SAMPLES = 150;
const LOOP_SAMPLES = 64;

const steps = (from: number, to: number, count: number) =>
  Array.from({ length: count }, (_, index) => from + ((to - from) * index) / count);

const { launch, towardsMoon, aroundMoon, towardsEarth, splashdown } = APOLLO_11;
const PARKING_TIMES = steps(launch, towardsMoon, PARKING_SAMPLES);
const OUTBOUND_TIMES = steps(towardsMoon, aroundMoon, TRANSFER_SAMPLES);
const RETURN_TIMES = [...steps(towardsEarth, splashdown, TRANSFER_SAMPLES), splashdown];

/** One turn around the Moon, where the Moon is at the given time (kept within the stay). */
const lunarLoop = (space: ApolloSpace, timestamp: number) => {
  const at = Math.min(Math.max(timestamp, aroundMoon), towardsEarth);
  const center = space.moonCenterAt(at);
  return Array.from({ length: LOOP_SAMPLES + 1 }, (_, index) => {
    const angle = (index / LOOP_SAMPLES) * Math.PI * 2;
    const offset = space.direction({ x: Math.cos(angle), y: Math.sin(angle), z: 0 });
    const radius = space.lunarOrbitRadius;
    return {
      x: center.x + offset.x * radius,
      y: center.y + offset.y * radius,
      z: center.z + offset.z * radius,
    };
  });
};

const along = (space: ApolloSpace, times: number[]) =>
  times.flatMap((time) => apolloPositionAt(space, time) ?? []);

const legsCache = new WeakMap<ApolloSpace, { start: Vector[]; end: Vector[] }>();

/** The trips to and from the Moon do not change: computed once per space. */
const legsIn = (space: ApolloSpace) => {
  const cached = legsCache.get(space);
  if (cached) return cached;
  const legs = {
    start: [...along(space, PARKING_TIMES), ...along(space, OUTBOUND_TIMES)],
    end: along(space, RETURN_TIMES),
  };
  legsCache.set(space, legs);
  return legs;
};

/**
 * Returns the drawn path at the given time: the waiting orbit, the trip to the Moon, one turn
 * around the Moon where it is then, and the trip back.
 */
export const apolloPathAt = (space: ApolloSpace, timestamp: number): Vector[] => {
  const { start, end } = legsIn(space);
  return [...start, ...lunarLoop(space, timestamp), ...end];
};
