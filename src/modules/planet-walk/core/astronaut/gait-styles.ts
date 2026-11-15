/** Below this gravity (m/s²), the astronaut lopes like the Apollo crews instead of running. */
const LOPE_BELOW_G = 2.5;
/**
 * A way of moving, over one cycle of the left leg (0 to 1, starting as its boot lands): when the
 * right leg follows, the share of the cycle a boot stays on the ground, how many hops a cycle holds,
 * and how the body, knees and arms move.
 */
export type Gait = {
  rightLeg: number;
  stance: number;
  hops: number;
  lean: number;
  hip: number;
  knee: number;
  arm: number;
  armForward: number;
  elbow: number;
  spread: number;
};

/** Running: legs take turns, two short flights per cycle, arms swinging against the legs. */
const RUN: Gait = {
  rightLeg: 0.5,
  stance: 0.35,
  hops: 2,
  lean: 0.12,
  hip: 0.55,
  knee: 1.3,
  arm: 0.6,
  armForward: 0.1,
  elbow: 1.3,
  spread: 0.12,
};
/**
 * Loping: one leg leads and the other lands just after it, then a long flight; the stiff suit keeps
 * the knees straighter, and the arms stay forward and out for balance.
 */
const LOPE: Gait = {
  rightLeg: 0.15,
  stance: 0.35,
  hops: 1,
  lean: 0.22,
  hip: 0.45,
  knee: 0.6,
  arm: 0.12,
  armForward: 0.35,
  elbow: 0.7,
  spread: 0.3,
};

export const gaitFor = (gravity: number) => (gravity < LOPE_BELOW_G ? LOPE : RUN);
