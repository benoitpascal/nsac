import type { Side, Weight } from './types';

/** The arm never tilts more than this angle (degrees) either way. */
export const MAX_TILT_DEGREES = 20;
/** Tilt (degrees) for each unit of torque difference between the sides. */
const DEGREES_PER_TORQUE = 4;

/** Sum of mass × distance of the weights hung on one side. */
export const sideTorque = (weights: readonly Weight[], side: Side) =>
  weights.reduce(
    (sum, weight) => (weight.hook?.side === side ? sum + weight.mass * weight.hook.distance : sum),
    0,
  );

/** Tells whether both sides pull the arm with the same torque. */
export const isBalanced = (weights: readonly Weight[]) =>
  sideTorque(weights, 'left') === sideTorque(weights, 'right');

/**
 * Angle of the arm in degrees, positive when the right side goes down, limited to
 * MAX_TILT_DEGREES either way.
 */
export const tiltDegrees = (weights: readonly Weight[]) => {
  const difference = sideTorque(weights, 'right') - sideTorque(weights, 'left');
  const angle = difference * DEGREES_PER_TORQUE;
  return Math.max(-MAX_TILT_DEGREES, Math.min(MAX_TILT_DEGREES, angle));
};

/** A level is solved once every weight hangs on a hook and the arm is balanced. */
export const isLevelSolved = (weights: readonly Weight[]) =>
  weights.every((weight) => weight.hook !== null) && isBalanced(weights);
