import { START_CREW } from './crew';
import type { Astronaut } from './crew';
import type { Job } from './jobs';

/** Food growing in the greenhouse: how much, and on which day it can be eaten. */
export type Crop = { kg: number; readyDay: number };

/** What the player chose on a played day, kept for the end-of-act summary. */
export type DayRecord = {
  day: number;
  jobs: Record<string, Job>;
  storm?: StormChoice;
  knowledge: number;
};

/** The day 3 choice: everyone into the shelter, or keep working through the storm. */
export type StormChoice = 'shelter' | 'work';

/** Everything that lasts from one day to the next. */
export type BaseState = {
  /** Day being played, from 1. */
  day: number;
  batteryKwh: number;
  oxygenKg: number;
  foodKg: number;
  knowledge: number;
  crew: Astronaut[];
  crops: Crop[];
  /** Regolith the robot brought on day one (kg): enough of it shields the lab. */
  regolithKg: number;
  history: DayRecord[];
};

/**
 * The base: battery size and daily needs (6 people breathing 0.84 kg of oxygen and eating
 * 1.8 kg of food each, rounded), the knowledge needed to leave for Mars, and the regolith that
 * shields the lab. Gameplay values, see DATA.md.
 */
export const BASE = {
  batteryCapacityKwh: 200,
  loadKwh: 150,
  oxygenPerDayKg: 5,
  foodPerDayKg: 11,
  knowledgeForMars: 100,
  shieldRegolithKg: 50,
};

/** The base on the morning of day 1, with the regolith the robot brought. */
export const startBase = (regolithKg: number): BaseState => ({
  day: 1,
  batteryKwh: 120,
  oxygenKg: 22,
  foodKg: 50,
  knowledge: 0,
  crew: START_CREW.map((astronaut) => ({ ...astronaut })),
  crops: [],
  regolithKg,
  history: [],
});

/** Whether the lab is shielded by enough regolith to keep working during a solar storm. */
export const labShielded = (state: BaseState): boolean => state.regolithKg >= BASE.shieldRegolithKg;
