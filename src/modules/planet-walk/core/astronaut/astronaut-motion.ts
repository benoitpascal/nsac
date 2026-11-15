import { airPose } from './air-pose';
import { cyclesPerSecond, stridePose } from './gait';
import { blendPoses, crouch, easeToward, idlePose } from './pose';
import { JUMP_SPEED, JUMP_WIND_UP_S } from '../walker';
import type { Walker } from '../walker';
import type { Pose } from './pose';

/**
 * What the astronaut's body remembers from one frame to the next: where it is in its stride, how
 * much it is striding and flying (0 to 1, eased so that poses flow into each other), how deep it
 * still crouches from a landing, its clock (s), and where the walker last stood.
 */
export type Motion = {
  cycle: number;
  striding: number;
  flying: number;
  landing: number;
  clock: number;
  last: Walker;
};

/** How fast (per second) the body eases into and out of striding and flying. */
const EASE = { striding: 6, flying: 10 };
/** How long (s) a landing crouch lasts under Earth's gravity; it lasts longer under weaker gravity. */
const LANDING_S = 0.3;
const EARTH_G = 9.81;
/** How deep the legs bend before a jump, as a share of a full landing crouch. */
const WIND_UP_DEPTH = 0.75;
/** Share of the wind-up spent bending down; the rest pushes up. */
const BEND_SHARE = 0.6;

export const startMotion = (walker: Walker): Motion => ({
  cycle: 0,
  striding: 0,
  flying: 0,
  landing: 0,
  clock: 0,
  last: walker,
});

/**
 * How deep (0 to 1) the legs are bent before a jump: they bend down for most of the wind-up, then
 * push the body up so that they are straight again as the boots leave the ground.
 */
const windingUp = (walker: Walker) => {
  if (!walker.windUp) return 0;
  const share = 1 - walker.windUp / JUMP_WIND_UP_S;
  return WIND_UP_DEPTH * (share < BEND_SHARE ? share / BEND_SHARE : (1 - share) / (1 - BEND_SHARE));
};

/** Returns the walker's speed (m/s) along where it faces: negative when walking backwards. */
const forwardSpeed = (from: Walker, to: Walker, seconds: number) => {
  if (seconds <= 0) return 0;
  const [dx, dz] = [to.x - from.x, to.z - from.z];
  return (-Math.sin(to.heading) * dx - Math.cos(to.heading) * dz) / seconds;
};

/**
 * Moves the astronaut's body on by the given time (s) as the walker moves under the given gravity
 * (m/s²), and returns its new memory with the pose to show: standing and breathing, striding in
 * the way its gravity allows, bending its legs before a jump, flying, and crouching as it lands,
 * the deeper the faster it comes down.
 */
export const stepMotion = (motion: Motion, walker: Walker, gravity: number, seconds: number) => {
  const speed = forwardSpeed(motion.last, walker, seconds);
  const airborne = walker.verticalSpeed !== 0;
  const wasAirborne = motion.last.verticalSpeed !== 0;
  const recovery = LANDING_S * Math.sqrt(Math.sqrt(EARTH_G / gravity));
  const impact = Math.min(1, -motion.last.verticalSpeed / JUMP_SPEED);
  const landing =
    wasAirborne && !airborne ? impact : Math.max(0, motion.landing - seconds / recovery);
  const moving = Math.abs(speed) > 0.2 && !airborne;
  const turn = moving ? Math.sign(speed) * cyclesPerSecond(speed, gravity) * seconds : 0;
  const next: Motion = {
    cycle: (motion.cycle + turn + 1) % 1,
    striding: easeToward(motion.striding, moving ? 1 : 0, EASE.striding, seconds),
    flying: easeToward(motion.flying, airborne ? 1 : 0, EASE.flying, seconds),
    landing,
    clock: motion.clock + seconds,
    last: walker,
  };
  const ground = blendPoses(
    idlePose(next.clock),
    stridePose(next.cycle, speed, gravity),
    next.striding,
  );
  const pose: Pose = crouch(
    blendPoses(ground, airPose(walker.verticalSpeed), next.flying),
    Math.max(landing, windingUp(walker)),
  );
  return { motion: next, pose };
};
