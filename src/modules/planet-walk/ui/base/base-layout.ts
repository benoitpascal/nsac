import { createCrateStack } from './outpost/cargo-crates.mesh';
import { createGeodesicDome } from './outpost/geodesic-dome.mesh';
import { createSecondaryModule } from './outpost/secondary-module.mesh';
import { createTankSkid } from './outpost/tank-skid.mesh';
import { createLatticeMast } from './lattice-mast.mesh';
import type { Assembler } from '@/modules/globe/ui/bodies/satellite/assembled.body';
import type { GroundZone } from '../../core/excavator/ground-zone';

/** One piece of equipment: its model, size factor, place (m, from the base center) and turn. */
export type Placement = { assemble: Assembler; scale: number; x: number; z: number; turn?: number };

/** Where the base stands, ahead of the walker's start, and the ground it keeps free of rocks. */
export const BASE_SITE = { x: 0, z: -32, radius: 50 };

/** Where the cross-shaped habitat's hall stands, from the base center. */
export const HABITAT_SPOT = { x: -26, z: 14 };

/** Where the regolith dig site lies, from the base center, near the walker's start. */
export const DIG_SITE_SPOT = { x: 18, z: 27 };

/** Where the robot may dig, from the dig site's center (m): around its dug patch and its pile. */
export const DIG_ZONE: GroundZone = { minX: -6, maxX: 10, minZ: -5, maxZ: 5 };

/** Where the robot drops off its regolith, from the base center (m): outside, along the workshops' wing. */
export const DROP_ZONE: GroundZone = { minX: -22, maxX: -16, minZ: 32, maxZ: 38 };

/** Where the glass greenhouse dome stands (m, from the base center). */
export const GREENHOUSE_SPOT = { x: -13, z: -6 };

const HALF_TURN = Math.PI;
const QUARTER_TURN = Math.PI / 2;

/**
 * The outpost around the walker's way in, as on the base's poster: two crew modules and a lab, a
 * glass greenhouse dome, battery crates, water and oxygen tanks, the electrolyzer making oxygen from
 * water, and a relay mast.
 */
export const LAYOUT: Placement[] = [
  {
    assemble: () => createSecondaryModule({ width: 4, height: 3, length: 7 }),
    scale: 1,
    x: -5,
    z: 0,
  },
  {
    assemble: () => createSecondaryModule({ width: 4, height: 3, length: 7 }),
    scale: 1,
    x: 5,
    z: 0,
  },
  {
    assemble: () => createSecondaryModule({ width: 4.4, height: 3.4, length: 8 }),
    scale: 1,
    x: 0,
    z: -9,
    turn: QUARTER_TURN,
  },
  { assemble: createGeodesicDome, scale: 1, ...GREENHOUSE_SPOT },
  { assemble: createCrateStack, scale: 1, x: -12, z: 6, turn: HALF_TURN / 8 },
  {
    assemble: () => createTankSkid({ count: 1, radius: 1, length: 3, upright: false }),
    scale: 1,
    x: 12,
    z: -6,
  },
  {
    assemble: () => createTankSkid({ count: 3, radius: 0.45, length: 1.2, upright: true }),
    scale: 1,
    x: 13,
    z: 0,
  },
  {
    assemble: () => createSecondaryModule({ width: 3, height: 2.6, length: 4 }),
    scale: 1,
    x: 12,
    z: 6,
    turn: -QUARTER_TURN,
  },
  { assemble: () => createLatticeMast(9), scale: 1, x: -20, z: 3 },
];
