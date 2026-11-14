import { Group } from 'three';
import { capsule, ring, roundedBox } from './suit-shapes';
import type { SuitMaterials } from './astronaut-materials';
import type { Place } from './suit-shapes';

/** A limb in two parts: turning the root swings it all, turning the joint bends its lower part. */
export type Limb = { root: Group; joint: Group };

const pivot = (place: Place) => {
  const group = new Group();
  group.position.set(...place);
  return group;
};

/** A leg hanging from the hip: thigh, knee bearing, shin and a thick boot with its sole. */
export const createLeg = (hip: Place, suit: SuitMaterials): Limb => {
  const root = pivot(hip);
  const joint = pivot([0, -0.42, 0]);
  root.add(
    capsule(0.11, 0.24, [0, -0.2, 0], suit.fabric),
    ring(0.112, 0.016, [0, -0.25, 0], suit.stripe),
    joint,
  );
  joint.add(
    ring(0.104, 0.018, [0, 0, 0], suit.metal),
    capsule(0.1, 0.22, [0, -0.2, 0], suit.fabric),
    roundedBox([0.15, 0.13, 0.28], 0.045, [0, -0.46, -0.04], suit.hard),
    roundedBox([0.16, 0.03, 0.29], 0.012, [0, -0.515, -0.04], suit.dark),
  );
  return { root, joint };
};

/** An arm hanging from the shoulder: upper arm with a band, elbow, forearm, wrist ring, glove. */
export const createArm = (shoulder: Place, side: number, suit: SuitMaterials): Limb => {
  const root = pivot(shoulder);
  const joint = pivot([0, -0.3, 0]);
  root.add(
    capsule(0.088, 0.15, [0, -0.15, 0], suit.fabric),
    ring(0.09, 0.014, [0, -0.13, 0], suit.stripe),
    joint,
  );
  joint.add(
    ring(0.086, 0.014, [0, 0, 0], suit.metal),
    capsule(0.08, 0.13, [0, -0.13, 0], suit.fabric),
    ring(0.08, 0.016, [0, -0.26, 0], suit.metal),
    roundedBox([0.1, 0.14, 0.12], 0.04, [0, -0.34, -0.01], suit.hard),
    capsule(0.022, 0.05, [-side * 0.05, -0.31, -0.04], suit.hard),
  );
  root.rotation.z = side * 0.1;
  return { root, joint };
};
