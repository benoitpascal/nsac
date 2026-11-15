import { createAstronaut } from './astronaut.mesh';
import { createHeadlamp } from './headlamp';
import { startMotion, stepMotion } from '../../core/astronaut/astronaut-motion';
import { startWalker } from '../../core/walker';
import type { Pose } from '../../core/astronaut/pose';
import type { Walker } from '../../core/walker';
import type { Scene, WebGLRenderer } from 'three';
import type { Limb } from './suit-limbs';

/** Turns the limbs to the pose: thighs and arms swing, knees and elbows bend, arms spread. */
const applyPose = (pose: Pose, arms: Limb[], legs: Limb[]) => {
  legs.forEach(({ root, joint }, index) => {
    root.rotation.x = pose.hips[index];
    joint.rotation.x = -pose.knees[index];
  });
  arms.forEach(({ root, joint }, index) => {
    root.rotation.x = pose.shoulders[index];
    root.rotation.z = (index === 0 ? -1 : 1) * pose.spread;
    joint.rotation.x = pose.elbows[index];
  });
};

/**
 * Shows the walker as an astronaut standing where the walker is and facing the same way, moving
 * as its world's gravity allows: running on Earth or Mars, loping on the Moon with long hops,
 * stretching then tucking its legs after a jump, and crouching as it lands.
 */
export const createAstronautAvatar = (scene: Scene, renderer: WebGLRenderer) => {
  const { astronaut, arms, legs } = createAstronaut(renderer);
  astronaut.rotation.order = 'YXZ';
  scene.add(astronaut);
  const headlamp = createHeadlamp(scene);
  let motion = startMotion(startWalker());
  return {
    follow: (walker: Walker, visible: boolean, lamp: number, seconds: number, gravity: number) => {
      astronaut.visible = visible;
      headlamp.follow(walker, lamp);
      const { motion: next, pose } = stepMotion(motion, walker, gravity, seconds);
      motion = next;
      astronaut.position.set(walker.x, walker.height + pose.lift, walker.z);
      astronaut.rotation.set(-pose.lean, walker.heading, 0);
      applyPose(pose, arms, legs);
    },
  };
};
