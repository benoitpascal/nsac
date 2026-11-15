import type { WalkWorldId } from '../walk-worlds';

/** What the base lives with on a world's surface. */
export type WorldConditions = {
  /** Length of a full day and night, from noon to noon (h). */
  solarDayHours: number;
  /** Ground-level temperature at midday and in the middle of the night (°C). */
  dayCelsius: number;
  nightCelsius: number;
  /** Sunlight reaching the ground at midday (W/m²). */
  sunlightWm2: number;
  /** Radiation dose rate at the surface (µSv/h). */
  radiationMicroSvPerHour: number;
  /** A local midnight of the base (Unix ms), from which days are counted; 1 January 2000 by default. */
  midnightMs?: number;
};

/**
 * Surface conditions of each world (NASA fact sheets; radiation from Chang'e 4 on the Moon and
 * Curiosity's RAD on Mars; Mercury's surface dose is an estimate, never measured).
 */
export const WORLD_CONDITIONS: Record<WalkWorldId, WorldConditions> = {
  moon: {
    // A lunar day lasts one synodic month (29.53 days). The base faces the Earth, so its midnight
    // falls at new Moon: here the new Moon of 6 January 2000, 18:14 UTC, so the sky follows the
    // real phases.
    solarDayHours: 708.734,
    midnightMs: Date.UTC(2000, 0, 6, 18, 14),
    dayCelsius: 120,
    nightCelsius: -170,
    sunlightWm2: 1361,
    radiationMicroSvPerHour: 57,
  },
  mercury: {
    solarDayHours: 4222.6,
    dayCelsius: 430,
    nightCelsius: -180,
    sunlightWm2: 9126,
    radiationMicroSvPerHour: 65,
  },
  mars: {
    solarDayHours: 24.66,
    dayCelsius: -10,
    nightCelsius: -80,
    sunlightWm2: 500,
    radiationMicroSvPerHour: 28,
  },
  venus: {
    solarDayHours: 2802,
    dayCelsius: 464,
    nightCelsius: 464,
    sunlightWm2: 17,
    radiationMicroSvPerHour: 0.1,
  },
  earth: {
    solarDayHours: 24,
    dayCelsius: 22,
    nightCelsius: 10,
    sunlightWm2: 1000,
    radiationMicroSvPerHour: 0.11,
  },
};
