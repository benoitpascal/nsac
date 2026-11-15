/**
 * The excavator robot, a small robot like NASA's RASSOR (rounded): its battery and power draw, how
 * much regolith its drums hold, and how fast they scoop it up and empty it.
 */
export const EXCAVATOR = {
  batteryKwh: 0.1,
  /** Share of the battery charged at the start. */
  startCharge: 0.3,
  drivingKw: 0.6,
  /**
   * Power drawn while the drums turn, to dig or to unload. Digging is sped up 2.5 times for play
   * (1 kg/s at 0.9 kW before), and the power with it, so each kilogram costs the same energy.
   */
  drumKw: 2.25,
  loadKg: 80,
  digKgPerSecond: 2.5,
  unloadKgPerSecond: 10,
};

/** What the robot holds: energy left, regolith on board, and regolith dropped off at the base. */
export type ExcavatorStore = { batteryKwh: number; carriedKg: number; deliveredKg: number };

/** What the robot did over a moment: roll or turn, dig, unload. */
export type ExcavatorWork = { moving: boolean; digging: boolean; unloading: boolean };

const SECONDS_PER_HOUR = 3600;

/** Starts partly charged, with nothing dug yet. */
export const startExcavatorStore = (): ExcavatorStore => ({
  batteryKwh: EXCAVATOR.batteryKwh * EXCAVATOR.startCharge,
  carriedKg: 0,
  deliveredKg: 0,
});

/** Whether the battery still has energy: an empty robot can neither drive, dig nor unload. */
export const hasCharge = (store: ExcavatorStore): boolean => store.batteryKwh > 0;

/** Whether the drums are full, so that the robot can no longer dig. */
export const isFull = (store: ExcavatorStore): boolean => store.carriedKg >= EXCAVATOR.loadKg;

/** Returns the share of the battery left, from 0 (empty) to 1 (full). */
export const batteryShare = (store: ExcavatorStore): number =>
  store.batteryKwh / EXCAVATOR.batteryKwh;

/**
 * Returns the store after the given time (s): moving and turning the drums drain the battery,
 * digging fills the drums up to their load, unloading empties them into the base's stock.
 */
export const stepExcavatorStore = (
  store: ExcavatorStore,
  work: ExcavatorWork,
  seconds: number,
): ExcavatorStore => {
  const drums = work.digging || work.unloading;
  const drawKw = (work.moving ? EXCAVATOR.drivingKw : 0) + (drums ? EXCAVATOR.drumKw : 0);
  const dug = work.digging ? EXCAVATOR.digKgPerSecond * seconds : 0;
  const unloaded = work.unloading
    ? Math.min(EXCAVATOR.unloadKgPerSecond * seconds, store.carriedKg)
    : 0;
  return {
    batteryKwh: Math.max(0, store.batteryKwh - (drawKw * seconds) / SECONDS_PER_HOUR),
    carriedKg: Math.min(store.carriedKg + dug, EXCAVATOR.loadKg) - unloaded,
    deliveredKg: store.deliveredKg + unloaded,
  };
};
