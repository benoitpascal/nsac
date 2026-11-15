import { Group } from 'three';
import { capsule, ring, roundedBox } from './suit-shapes';
import type { SuitMaterials } from './astronaut-materials';
import type { Place } from './suit-shapes';
import type { Material } from 'three';

/** A limb in two parts: turning the root swings it all, turning the joint bends its lower part. */
export type Limb = { root: Group; joint: Group };

const pivot = (place: Place) => {
  const group = new Group();
  group.position.set(...place);
  return group;
};

/** Folds of cloth around a joint, like a bellows, so that the pressurized limb can bend. */
const bellows = (radius: number, material: Material) =>
  [-0.03, 0.03].map((y) => ring(radius, 0.014, [0, y, 0], material));

/** The mission patch high on the left arm. */
const patch = (suit: SuitMaterials) =>
  roundedBox([0.012, 0.07, 0.1], 0.004, [-0.093, -0.08, 0], suit.patch);

/** A big lunar boot: a thick dark sole with lugs, a toe cap and a dusty upper. */
const boot = (suit: SuitMaterials) => [
  roundedBox([0.17, 0.16, 0.3], 0.05, [0, -0.45, -0.04], suit.boot),
  roundedBox([0.15, 0.08, 0.1], 0.03, [0, -0.49, -0.17], suit.boot),
  roundedBox([0.18, 0.045, 0.32], 0.015, [0, -0.54, -0.04], suit.dark),
];

/** A leg hanging from the hip: bearing ring, thigh, bellows knee, dusty shin and a big boot. */
export const createLeg = (hip: Place, suit: SuitMaterials): Limb => {
  const root = pivot(hip);
  const joint = pivot([0, -0.42, 0]);
  root.add(
    ring(0.118, 0.018, [0, -0.02, 0], suit.metal),
    capsule(0.115, 0.22, [0, -0.2, 0], suit.dusty),
    ring(0.118, 0.016, [0, -0.25, 0], suit.stripe),
    joint,
  );
  joint.add(
    ...bellows(0.112, suit.dusty),
    capsule(0.108, 0.2, [0, -0.2, 0], suit.dusty),
    ring(0.105, 0.016, [0, -0.33, 0], suit.metal),
    ...boot(suit),
  );
  return { root, joint };
};

/** An arm hanging from the shoulder: band, bellows elbow, forearm, wrist bearing, dark glove. */
export const createArm = (shoulder: Place, side: number, suit: SuitMaterials): Limb => {
  const root = pivot(shoulder);
  const joint = pivot([0, -0.3, 0]);
  root.add(
    capsule(0.092, 0.15, [0, -0.15, 0], suit.fabric),
    ...(side < 0 ? [patch(suit)] : []),
    ring(0.094, 0.014, [0, -0.13, 0], suit.stripe),
    joint,
  );
  joint.add(
    ...bellows(0.09, suit.fabric),
    capsule(0.084, 0.13, [0, -0.13, 0], suit.fabric),
    ring(0.085, 0.02, [0, -0.25, 0], suit.metal),
    capsule(0.07, 0.04, [0, -0.29, 0], suit.dark),
    roundedBox([0.1, 0.15, 0.12], 0.045, [0, -0.37, -0.01], suit.dark),
    capsule(0.024, 0.05, [-side * 0.055, -0.34, -0.04], suit.dark),
  );
  root.rotation.z = side * 0.1;
  return { root, joint };
};
