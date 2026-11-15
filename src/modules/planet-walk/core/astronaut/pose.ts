/** A pair of values for the left then the right limb. */
export type Pair = [number, number];

/**
 * How the astronaut holds itself (radians, m): thighs swung forward at the hips, knees bent, arms
 * swung forward at the shoulders, elbows bent, arms spread out to the sides, the whole body leaning
 * forward, and lifted off the ground (hopping).
 */
export type Pose = {
  hips: Pair;
  knees: Pair;
  shoulders: Pair;
  elbows: Pair;
  spread: number;
  lean: number;
  lift: number;
};

/** Standing still: knees and elbows slightly bent, as a pressurized suit holds them. */
export const STANDING: Pose = {
  hips: [0, 0],
  knees: [0.08, 0.08],
  shoulders: [0.05, 0.05],
  elbows: [0.4, 0.4],
  spread: 0.14,
  lean: 0,
  lift: 0,
};

const mix = (from: number, to: number, share: number) => from + (to - from) * share;
const mixPair = (from: Pair, to: Pair, share: number): Pair => [
  mix(from[0], to[0], share),
  mix(from[1], to[1], share),
];

/** Returns the pose the given share (0 to 1) of the way from one pose to another. */
export const blendPoses = (from: Pose, to: Pose, share: number): Pose => ({
  hips: mixPair(from.hips, to.hips, share),
  knees: mixPair(from.knees, to.knees, share),
  shoulders: mixPair(from.shoulders, to.shoulders, share),
  elbows: mixPair(from.elbows, to.elbows, share),
  spread: mix(from.spread, to.spread, share),
  lean: mix(from.lean, to.lean, share),
  lift: mix(from.lift, to.lift, share),
});

/** Moves a value towards a goal, closing the gap at the given rate (per second), without overshoot. */
export const easeToward = (value: number, goal: number, rate: number, seconds: number) =>
  mix(value, goal, 1 - Math.exp(-rate * seconds));

/** Standing pose breathing slowly: the chest rises a few millimeters every few seconds. */
export const idlePose = (seconds: number): Pose => ({
  ...STANDING,
  lift: 0.004 * (1 + Math.sin((2 * Math.PI * seconds) / 4)),
});

/**
 * Bends the pose down by the given amount (0 to 1), as the legs soak up a landing: knees and hips
 * fold, the body sinks and leans, and the arms come forward.
 */
export const crouch = (pose: Pose, amount: number): Pose => ({
  ...pose,
  hips: [pose.hips[0] + 0.45 * amount, pose.hips[1] + 0.45 * amount],
  knees: [pose.knees[0] + 0.9 * amount, pose.knees[1] + 0.9 * amount],
  shoulders: [pose.shoulders[0] + 0.3 * amount, pose.shoulders[1] + 0.3 * amount],
  lean: pose.lean + 0.15 * amount,
  /** Lowered so that the folded legs keep the boots on the ground. */
  lift: pose.lift - 0.09 * amount,
});
