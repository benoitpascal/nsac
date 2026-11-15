import { BoxGeometry, CylinderGeometry, Group, Mesh } from 'three';
import type { Material } from 'three';

/** Bucket drum size (m): radius, width, and the number of scoops around it. */
export const DRUM = { radius: 0.3, width: 0.75, scoops: 8 };
/** Arm length (m), from its hinge on the chassis to the drum axle. */
export const ARM_LENGTH = 0.7;

/** A drum lying across the robot (along z), ringed with scoops that pick up regolith. */
const drum = (shell: Material, scoopMaterial: Material) => {
  const body = new Mesh(
    new CylinderGeometry(DRUM.radius * 0.8, DRUM.radius * 0.8, DRUM.width, 24),
    shell,
  );
  body.rotation.x = Math.PI / 2;
  const spinning = new Group();
  spinning.add(body);
  for (let index = 0; index < DRUM.scoops; index++) {
    const angle = (index / DRUM.scoops) * Math.PI * 2;
    const scoop = new Mesh(new BoxGeometry(0.12, 0.06, DRUM.width * 0.95), scoopMaterial);
    scoop.position.set(
      Math.cos(angle) * DRUM.radius * 0.85,
      Math.sin(angle) * DRUM.radius * 0.85,
      0,
    );
    scoop.rotation.z = angle + Math.PI / 4;
    spinning.add(scoop);
  }
  return spinning;
};

/**
 * An arm hinged on the chassis, reaching out along +x to a bucket drum: turning the returned arm
 * around z raises or lowers the drum, turning the returned drum spins it.
 */
export const createDrumArm = (frame: Material, shell: Material, scoopMaterial: Material) => {
  const arm = new Group();
  for (const side of [-1, 1]) {
    const plate = new Mesh(new BoxGeometry(ARM_LENGTH, 0.08, 0.05), frame);
    plate.position.set(ARM_LENGTH / 2, 0, side * (DRUM.width / 2 + 0.04));
    arm.add(plate);
  }
  const spinning = drum(shell, scoopMaterial);
  spinning.position.x = ARM_LENGTH;
  arm.add(spinning);
  return { arm, drum: spinning };
};
