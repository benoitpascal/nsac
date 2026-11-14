import { assembledBody } from '../satellite/assembled.body';
import { assembleBattery } from './parts/battery.parts';
import { assembleElectrolyzer } from './parts/electrolyzer.parts';
import { assembleGreenhouse } from './parts/greenhouse.parts';
import { assembleHabitatModule } from './parts/habitat-module.parts';
import { assembleLab } from './parts/lab.parts';
import { assembleOxygenTanks } from './parts/oxygen-tanks.parts';
import { assembleRations } from './parts/rations.parts';
import { assembleRelayAntenna } from './parts/relay-antenna.parts';
import { assembleSolarPanel } from './parts/solar-panel.parts';
import { assembleWaterTank } from './parts/water-tank.parts';
import type { CelestialBodyId } from '../../../core/bodies';
import type { BodyFactory } from '../body';

/** Factories of the mission equipment models, scaled to fit the view. */
export const EQUIPMENT_FACTORIES = {
  'solar-panel': assembledBody(assembleSolarPanel, 1.1),
  battery: assembledBody(assembleBattery, 1.4),
  'oxygen-tanks': assembledBody(assembleOxygenTanks, 1.2),
  electrolyzer: assembledBody(assembleElectrolyzer, 1.5),
  rations: assembledBody(assembleRations, 1.5),
  greenhouse: assembledBody(assembleGreenhouse, 1.4),
  'water-tank': assembledBody(assembleWaterTank, 1.2),
  lab: assembledBody(assembleLab, 1.4),
  'relay-antenna': assembledBody(assembleRelayAntenna, 1.4),
  'habitat-module': assembledBody(assembleHabitatModule, 1),
} satisfies Partial<Record<CelestialBodyId, BodyFactory>>;
