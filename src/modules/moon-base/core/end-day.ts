import { BASE } from './base-state';
import { FATIGUE, MAX_FATIGUE } from './crew';
import { GROW_DAYS } from './jobs';
import { planEffects } from './plan-day';
import type { BaseState } from './base-state';
import type { Astronaut } from './crew';
import type { Job } from './jobs';
import type { DayPlan } from './plan-day';

/** What the end of the day tells the player. */
export type DayReport = {
  day: number;
  solarKwh: number;
  usedKwh: number;
  /** Power the full battery could not store (kWh). */
  wastedKwh: number;
  oxygenMadeKg: number;
  harvestedKg: number;
  plantedKg: number;
  knowledge: number;
  /** Astronauts the doctor sends to rest after staying outside the shelter during the storm. */
  sentToRest: string[];
};

/**
 * Tiredness after the day: rest restores and work tires. Outside the storm shelter everyone gets a
 * radiation dose and the doctor orders rest; inside it nobody rests well, as it is cramped.
 */
const tiredAfter = (astronaut: Astronaut, job: Job, storm: DayPlan['storm']): number => {
  if (storm === 'work') return MAX_FATIGUE;
  if (job === 'rest' && storm === 'shelter') return astronaut.fatigue;
  if (job === 'rest') return Math.max(0, astronaut.fatigue - FATIGUE.rest);
  return Math.min(MAX_FATIGUE, astronaut.fatigue + FATIGUE.work);
};

/**
 * Plays the day as planned and returns the base on the next morning with the day's report: power
 * flows in and out of the battery (what does not fit is lost), the crew breathes and eats, ripe
 * food is harvested, new crops start growing, work tires the crew and rest restores it, and the
 * solar storm tires the crew whatever they choose (see tiredAfter).
 */
export const endDay = (state: BaseState, plan: DayPlan) => {
  const effects = planEffects(state, plan);
  const harvestedKg = state.crops
    .filter((crop) => crop.readyDay === state.day)
    .reduce((sum, crop) => sum + crop.kg, 0);
  const crops = state.crops.filter((crop) => crop.readyDay > state.day);
  if (effects.foodPlantedKg > 0)
    crops.push({ kg: effects.foodPlantedKg, readyDay: state.day + GROW_DAYS });
  const crew = state.crew.map((astronaut) => {
    const job = effects.jobs[astronaut.id] ?? 'rest';
    return { ...astronaut, fatigue: tiredAfter(astronaut, job, plan.storm) };
  });
  const sentToRest = plan.storm === 'work' ? state.crew.map(({ name }) => name) : [];
  const batteryKwh = Math.min(Math.max(effects.batteryAfterKwh, 0), BASE.batteryCapacityKwh);
  const next: BaseState = {
    ...state,
    day: state.day + 1,
    batteryKwh,
    oxygenKg: state.oxygenKg + effects.oxygenMadeKg - BASE.oxygenPerDayKg,
    foodKg: state.foodKg + harvestedKg - BASE.foodPerDayKg,
    knowledge: state.knowledge + effects.knowledge,
    crew,
    crops,
    history: [
      ...state.history,
      { day: state.day, jobs: effects.jobs, storm: plan.storm, knowledge: effects.knowledge },
    ],
  };
  const report: DayReport = {
    day: state.day,
    solarKwh: effects.solarKwh,
    usedKwh: effects.usedKwh,
    wastedKwh: Math.max(0, effects.batteryAfterKwh - BASE.batteryCapacityKwh),
    oxygenMadeKg: effects.oxygenMadeKg,
    harvestedKg,
    plantedKg: effects.foodPlantedKg,
    knowledge: effects.knowledge,
    sentToRest,
  };
  return { state: next, report };
};
