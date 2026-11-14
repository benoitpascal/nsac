import { WORLD_CONDITIONS } from './conditions';
import { isDaytime, localDayShare, outsideCelsius, sunHeight } from './local-time';
import { STATION } from './resources';
import type { StationStores } from './resources';
import type { WalkWorldId } from '../walk-worlds';

/** Solar panels of the base: total area (m²) and share of sunlight turned into power. */
const PANELS = { areaM2: 70, efficiency: 0.28 };
const WATTS_PER_KW = 1000;

/** Everything the station dashboard shows at a given time. */
export type StationReadings = StationStores & {
  timestamp: number;
  dayShare: number;
  daytime: boolean;
  outsideCelsius: number;
  radiationMicroSvPerHour: number;
  generationKw: number;
  loadKw: number;
  batteryShare: number;
  /** How many days the oxygen lasts if none were made, and how many days the food lasts. */
  oxygenDays: number;
  foodDays: number;
};

/** Returns the power (kW) the base's solar panels make on the world at that time. */
export const solarPowerKw = (world: WalkWorldId, timestamp: number): number => {
  const conditions = WORLD_CONDITIONS[world];
  const sun = sunHeight(localDayShare(conditions, timestamp));
  return (conditions.sunlightWm2 * sun * PANELS.areaM2 * PANELS.efficiency) / WATTS_PER_KW;
};

/** Returns what the dashboard shows on the world at that time, with the stores as they are. */
export const stationReadings = (
  world: WalkWorldId,
  timestamp: number,
  stores: StationStores,
): StationReadings => {
  const conditions = WORLD_CONDITIONS[world];
  const dayShare = localDayShare(conditions, timestamp);
  return {
    ...stores,
    timestamp,
    dayShare,
    daytime: isDaytime(dayShare),
    outsideCelsius: outsideCelsius(conditions, dayShare),
    radiationMicroSvPerHour: conditions.radiationMicroSvPerHour,
    generationKw: solarPowerKw(world, timestamp),
    loadKw: STATION.baseLoadKw,
    batteryShare: stores.batteryKwh / STATION.batteryCapacityKwh,
    oxygenDays: stores.oxygenKg / (STATION.crew * STATION.oxygenPerPersonPerDay),
    foodDays: stores.foodKg / (STATION.crew * STATION.foodPerPersonPerDay),
  };
};
