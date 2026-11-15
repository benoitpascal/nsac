import type { WorldConditions } from './conditions';

const MS_PER_HOUR = 3_600_000;
const NOON_SHARE = 0.5;
const SUNRISE_SHARE = 0.25;

/**
 * Returns how far the base is into its local day (0 at midnight, 0.5 at noon) at the given time
 * (Unix ms): days are counted from 1 January 2000, the base's first midnight.
 */
export const localDayShare = (conditions: WorldConditions, timestamp: number): number => {
  const hours = (timestamp - Date.UTC(2000, 0, 1)) / MS_PER_HOUR;
  const days = hours / conditions.solarDayHours;
  return days - Math.floor(days);
};

/** Returns how high the Sun stands, from 0 (below the horizon) to 1 (overhead at noon). */
export const sunHeight = (dayShare: number): number =>
  Math.max(0, Math.sin((dayShare - SUNRISE_SHARE) * 2 * Math.PI));

/** Whether the Sun is up at that point of the local day. */
export const isDaytime = (dayShare: number): boolean =>
  Math.abs(dayShare - NOON_SHARE) < SUNRISE_SHARE;

/** Returns the ground temperature (°C): coldest before dawn, warmest after noon. */
export const outsideCelsius = (conditions: WorldConditions, dayShare: number): number => {
  const warmth = (1 + Math.sin((dayShare - SUNRISE_SHARE - 0.05) * 2 * Math.PI)) / 2;
  return conditions.nightCelsius + (conditions.dayCelsius - conditions.nightCelsius) * warmth;
};
