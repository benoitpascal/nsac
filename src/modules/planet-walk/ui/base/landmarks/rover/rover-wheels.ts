import { Group } from 'three';
import { box, ROVER_MATERIALS, sideCylinder } from './rover-parts';

/** Wheels (m): radius, tyre width, how far out from the middle, axles along the rover. */
export const WHEEL = { radius: 0.6, width: 0.5, side: 1.7, axles: [1.8, 0, -1.8] };
const TREADS = 14;

/** A big tyre with chunky treads and a metal hub, on its axis along x. */
const wheel = (side: number) => {
  const group = new Group();
  group.add(sideCylinder(WHEEL.radius * 0.93, WHEEL.width, [0, 0, 0], ROVER_MATERIALS.dark));
  group.add(sideCylinder(WHEEL.radius * 0.5, WHEEL.width + 0.04, [0, 0, 0], ROVER_MATERIALS.metal));
  group.add(
    sideCylinder(
      WHEEL.radius * 0.18,
      0.12,
      [side * (WHEEL.width / 2 + 0.06), 0, 0],
      ROVER_MATERIALS.dark,
    ),
  );
  for (let index = 0; index < TREADS; index++) {
    const angle = (index / TREADS) * Math.PI * 2;
    const tread = box(
      [WHEEL.width, 0.08, 0.14],
      [0, Math.sin(angle) * WHEEL.radius * 0.95, Math.cos(angle) * WHEEL.radius * 0.95],
      ROVER_MATERIALS.dark,
    );
    tread.rotation.x = -angle;
    group.add(tread);
  }
  return group;
};

/**
 * Builds the six wheels of the rover, three on each side, each held by a suspension arm reaching
 * in towards the chassis.
 */
export const createRoverWheels = () => {
  const wheels = new Group();
  for (const side of [-1, 1]) {
    for (const z of WHEEL.axles) {
      const tyre = wheel(side);
      tyre.position.set(side * WHEEL.side, WHEEL.radius, z);
      const arm = box(
        [0.6, 0.12, 0.18],
        [side * (WHEEL.side - 0.45), WHEEL.radius + 0.15, z],
        ROVER_MATERIALS.metal,
      );
      wheels.add(tyre, arm);
    }
  }
  return wheels;
};
