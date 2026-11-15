import type { BaseStores } from './base-stores';
import type { ToolId } from './scenario-content';

/** What the player packs before going out with the excavator robot. */
export type Loadout = { tool: ToolId; oxygenBottles: number; spareBatteries: number };

/** Rules of the bag and of each item (game values, see DATA.md). */
export const BAG = {
  slots: 4,
  maxBottles: 4,
  maxBatteries: 3,
  secondsPerBottle: 90,
  /** Air points a fully used bottle costs the base. */
  airPerBottle: 3,
  /** Power points the base spends per robot charge (0.03 kWh) actually used. */
  powerPerCharge: 4,
  chargeKwh: 0.03,
};

/** How each tool digs: kilograms per second and power drawn by the drums (kW). */
export const TOOLS: Record<ToolId, { name: string; digKgPerSecond: number; drumKw: number }> = {
  standardDrums: { name: 'Standard drums', digKgPerSecond: 1, drumKw: 0.9 },
  wideDrums: { name: 'Wide drums', digKgPerSecond: 1.6, drumKw: 1.4 },
};

export const DEFAULT_LOADOUT: Loadout = {
  tool: 'standardDrums',
  oxygenBottles: 1,
  spareBatteries: 0,
};

/** Returns the number of bag slots used: the tool, every bottle and every battery. */
export const slotsUsed = (loadout: Loadout) => 1 + loadout.oxygenBottles + loadout.spareBatteries;

/** Returns why the loadout cannot go out, or undefined when it can. */
export const loadoutProblem = (loadout: Loadout, stores: BaseStores): string | undefined => {
  if (loadout.oxygenBottles < 1) return 'Take at least one oxygen bottle.';
  if (slotsUsed(loadout) > BAG.slots) return 'Your bag is full.';
  if (loadout.oxygenBottles > BAG.maxBottles || loadout.spareBatteries > BAG.maxBatteries)
    return 'The base does not have that many.';
  if (stores.air < loadout.oxygenBottles * BAG.airPerBottle)
    return 'The base is too low on air to fill that many bottles.';
  if (stores.power < (1 + loadout.spareBatteries) * BAG.powerPerCharge)
    return 'The base is too low on power to charge that many batteries.';
  return undefined;
};

/** Returns the time outside (s) the bottles give. */
export const secondsOutside = (loadout: Loadout) => loadout.oxygenBottles * BAG.secondsPerBottle;

/** Returns the robot's energy for the mission (kWh): its own charge plus the spare batteries. */
export const robotEnergyKwh = (loadout: Loadout) => (1 + loadout.spareBatteries) * BAG.chargeKwh;
