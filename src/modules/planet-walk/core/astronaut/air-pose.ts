import { JUMP_SPEED } from '../walker';
import { STANDING } from './pose';
import type { Pose } from './pose';

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

/**
 * Returns the astronaut's pose in the air after a jump, from its vertical speed (m/s): legs
 * stretched and arms raised as it rises, then knees and hips folding up and arms coming forward
 * as it falls, ready to land.
 */
export const airPose = (verticalSpeed: number): Pose => {
  const rising = clamp(verticalSpeed / JUMP_SPEED);
  const falling = clamp(-verticalSpeed / JUMP_SPEED);
  const hip = 0.05 + 0.4 * falling;
  const knee = 0.12 + 0.6 * falling;
  return {
    ...STANDING,
    hips: [hip + 0.1 * rising, hip - 0.1 * rising],
    knees: [knee, knee + 0.15 * rising],
    shoulders: [0.25 * falling - 0.2 * rising, 0.25 * falling - 0.2 * rising],
    elbows: [0.5, 0.5],
    spread: 0.25 + 0.35 * rising,
    lean: 0.05 * falling,
  };
};
