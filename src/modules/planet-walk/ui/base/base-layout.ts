import type { GroundZone } from '../../core/excavator/ground-zone';
import type { Assembler } from '@/modules/globe/ui/bodies/satellite/assembled.body';
import { assembleBattery } from '@/modules/globe/ui/bodies/equipment/parts/battery.parts';
import { assembleElectrolyzer } from '@/modules/globe/ui/bodies/equipment/parts/electrolyzer.parts';
import { assembleGreenhouse } from '@/modules/globe/ui/bodies/equipment/parts/greenhouse.parts';
import { assembleHabitatModule } from '@/modules/globe/ui/bodies/equipment/parts/habitat-module.parts';
import { assembleLab } from '@/modules/globe/ui/bodies/equipment/parts/lab.parts';
import { assembleOxygenTanks } from '@/modules/globe/ui/bodies/equipment/parts/oxygen-tanks.parts';
import { assembleRelayAntenna } from '@/modules/globe/ui/bodies/equipment/parts/relay-antenna.parts';
import { assembleSolarPanel } from '@/modules/globe/ui/bodies/equipment/parts/solar-panel.parts';
import { assembleWaterTank } from '@/modules/globe/ui/bodies/equipment/parts/water-tank.parts';

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

const SOLAR_ROW = Array.from(
  { length: 7 },
  (_, index): Placement => ({
    assemble: assembleSolarPanel,
    scale: 3,
    x: (index - 3) * 4,
    z: -16,
  }),
);

export const LAYOUT: Placement[] = [
  { assemble: assembleHabitatModule, scale: 4, x: -5, z: 0 },
  { assemble: assembleHabitatModule, scale: 4, x: 5, z: 0, turn: Math.PI },
  { assemble: assembleLab, scale: 3, x: 0, z: -7 },
  { assemble: assembleGreenhouse, scale: 3, x: -13, z: -5 },
  { assemble: assembleBattery, scale: 2.5, x: -12, z: 6 },
  { assemble: assembleWaterTank, scale: 2.5, x: 12, z: -6 },
  { assemble: assembleOxygenTanks, scale: 2.5, x: 13, z: 0 },
  { assemble: assembleElectrolyzer, scale: 2.5, x: 12, z: 6 },
  { assemble: assembleRelayAntenna, scale: 3, x: -18, z: 2 },
  ...SOLAR_ROW,
];
