/** The base's stores. */
export type StationStores = {
  oxygenKg: number;
  batteryKwh: number;
  waterLiters: number;
  foodKg: number;
};

/** What changes the stores over a moment: solar power, and whether the excavator digs icy regolith. */
export type StoreFlows = { generationKw: number; digging: boolean };

/** Base equipment (sizes and rates from NASA life-support and ISRU studies, rounded). */
export const STATION = {
  crew: 4,
  batteryCapacityKwh: 200,
  /** Power drawn by the habitat (kW); the excavator robot runs on its own battery. */
  baseLoadKw: 8,
  /** Oxygen breathed per person, and made by electrolysis when the battery allows (kg per day). */
  oxygenPerPersonPerDay: 0.84,
  oxygenMadePerDay: 4,
  /** Water used per person per day, and drawn from icy regolith while digging (L per hour). */
  waterPerPersonPerDay: 3.5,
  waterDugPerHour: 50,
  /** Packaged food eaten per person per day (kg). */
  foodPerPersonPerDay: 1.8,
  /** Battery share (0–1) below which oxygen making stops, to keep power for the crew. */
  electrolysisMinCharge: 0.2,
};

const SECONDS_PER_HOUR = 3600;
const HOURS_PER_DAY = 24;

/** Starting stores: full tanks and a well charged battery. */
export const startStores = (): StationStores => ({
  oxygenKg: 1200,
  batteryKwh: 160,
  waterLiters: 6000,
  foodKg: 1500,
});

/** Returns the stores after the given time (s): the crew breathes, drinks and eats, power flows in and out. */
export const stepStores = (
  stores: StationStores,
  flows: StoreFlows,
  seconds: number,
): StationStores => {
  const hours = seconds / SECONDS_PER_HOUR;
  const days = hours / HOURS_PER_DAY;
  const charge = stores.batteryKwh / STATION.batteryCapacityKwh;
  const making = charge > STATION.electrolysisMinCharge ? STATION.oxygenMadePerDay : 0;
  const breathing = STATION.crew * STATION.oxygenPerPersonPerDay;
  const dug = flows.digging ? STATION.waterDugPerHour * hours : 0;
  const battery = stores.batteryKwh + (flows.generationKw - STATION.baseLoadKw) * hours;
  return {
    oxygenKg: Math.max(0, stores.oxygenKg + (making - breathing) * days),
    batteryKwh: Math.min(Math.max(battery, 0), STATION.batteryCapacityKwh),
    waterLiters: Math.max(
      0,
      stores.waterLiters + dug - STATION.crew * STATION.waterPerPersonPerDay * days,
    ),
    foodKg: Math.max(0, stores.foodKg - STATION.crew * STATION.foodPerPersonPerDay * days),
  };
};
