import { RUN_SPEED } from '../walker';
import { gaitFor } from './gait-styles';
import type { Gait } from './gait-styles';
import type { Pair, Pose } from './pose';

/** Length (m) of the astronaut's leg, from hip to sole. */
const LEG_M = 0.95;
/** Share of its time off the ground a leg takes to swing from behind to ahead. */
const SWING_THROUGH = 0.6;
/** Highest hop (m) shown, so that a fast lope stays a lope and not a jump. */
const HIGHEST_HOP_M = 0.3;

/** Leg cycles per second: slower under weaker gravity (pendulum-like legs), a bit faster when running. */
export const cyclesPerSecond = (speed: number, gravity: number) =>
  0.5 * Math.sqrt(gravity / LEG_M) * (0.75 + 0.25 * Math.min(Math.abs(speed) / RUN_SPEED, 1.5));

/** The leg's swing at the hip and bend at the knee, at its own point of the cycle. */
const leg = (cycle: number, gait: Gait): Pair => {
  if (cycle < gait.stance) {
    const share = cycle / gait.stance;
    return [gait.hip * (1 - 2 * share), 0.15 + 0.15 * Math.sin(Math.PI * share)];
  }
  /** The leg swings through in the first part of its flight, then reaches forward to land. */
  const share = Math.min(1, (cycle - gait.stance) / (1 - gait.stance) / SWING_THROUGH);
  return [-gait.hip * Math.cos(Math.PI * share), 0.1 + gait.knee * Math.sin(Math.PI * share)];
};

/** How high (m) the body flies at this point of the cycle: a hop of free fall between landings. */
const hop = (cycle: number, gait: Gait, speed: number, gravity: number) => {
  const step = (cycle * gait.hops) % 1;
  const support = gait.hops === 1 ? gait.rightLeg + gait.stance : gait.stance * gait.hops;
  if (step < support) return 0;
  const flight = (1 - support) / (cyclesPerSecond(speed, gravity) * gait.hops);
  const share = (step - support) / (1 - support);
  return Math.min((gravity * flight * flight) / 8, HIGHEST_HOP_M) * 4 * share * (1 - share);
};

/**
 * Returns the astronaut's pose at the given point (0 to 1) of its stride, moving at the given speed
 * (m/s) under the given gravity (m/s²).
 */
export const stridePose = (cycle: number, speed: number, gravity: number): Pose => {
  const gait = gaitFor(gravity);
  const [left, right] = [leg(cycle, gait), leg((cycle + 1 - gait.rightLeg) % 1, gait)];
  const swing = (hip: number) => gait.armForward + (hip / gait.hip) * gait.arm;
  return {
    hips: [left[0], right[0]],
    knees: [left[1], right[1]],
    shoulders: [swing(right[0]), swing(left[0])],
    elbows: [gait.elbow, gait.elbow],
    spread: gait.spread,
    lean: gait.lean,
    lift: hop(cycle, gait, speed, gravity),
  };
};
