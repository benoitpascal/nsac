import { createLampPost } from './cargo.mesh';
import { createCrateStack } from '../outpost/cargo-crates.mesh';
import { createInflatableHabitat } from './inflatable-habitat.mesh';
import { createLander } from './lander.mesh';
import { createRover } from './rover/rover.mesh';
import type { Placement } from '../base-layout';

const QUARTER_TURN = Math.PI / 2;

const lampPost = (x: number, z: number): Placement => ({
  assemble: createLampPost,
  scale: 1,
  x,
  z,
});

/**
 * Landmarks from NASA's Moon and Mars base concepts (m, from the base center): a crew lander on
 * the landing pad, an inflatable habitat on legs, a pressurized rover, supply crates and
 * lamp posts along the way in.
 */
export const LANDMARKS: Placement[] = [
  { assemble: createLander, scale: 1, x: 16, z: 14 },
  { assemble: createInflatableHabitat, scale: 1, x: 25, z: -4 },
  { assemble: createRover, scale: 1, x: -14, z: 28 },
  { assemble: createCrateStack, scale: 1, x: 6, z: 12 },
  { assemble: createCrateStack, scale: 1, x: 9.5, z: 12.5, turn: Math.PI },
  { assemble: createCrateStack, scale: 1, x: 7.5, z: 17, turn: QUARTER_TURN },
  lampPost(-3, 14),
  lampPost(3, 14),
  lampPost(-3, 20),
  lampPost(3, 20),
  lampPost(-8.5, 17),
];
