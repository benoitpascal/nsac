import { BASE, labShielded } from './base-state';
import { isExhausted } from './crew';
import { DEMO_DAYS } from './demo-days';
import { JOB_RULES, jobYield } from './jobs';
import type { BaseState, StormChoice } from './base-state';
import type { Astronaut } from './crew';
import type { Job } from './jobs';

/** The player's plan for the day: a job per astronaut id, and the storm choice on a storm day. */
export type DayPlan = { jobs: Record<string, Job>; storm?: StormChoice };

/** What the day will do if played as planned. */
export type DayEffects = {
  /** The job each astronaut really does: exhausted ones and sheltered ones rest. */
  jobs: Record<string, Job>;
  solarKwh: number;
  usedKwh: number;
  /** Battery left at the end of the day before it is capped to its size (kWh). */
  batteryAfterKwh: number;
  oxygenMadeKg: number;
  foodPlantedKg: number;
  knowledge: number;
};

/** The job the astronaut can really do today: rest when exhausted, or when sheltering from the storm. */
export const doableJob = (state: BaseState, astronaut: Astronaut, plan: DayPlan): Job => {
  const wanted = plan.jobs[astronaut.id] ?? 'rest';
  if (isExhausted(astronaut)) return 'rest';
  if (plan.storm !== 'shelter') return wanted;
  return wanted === 'research' && labShielded(state) ? 'research' : 'rest';
};

/** Returns what the day does with this plan: power made and used, oxygen, food and knowledge. */
export const planEffects = (state: BaseState, plan: DayPlan): DayEffects => {
  const totals = { solar: 0, used: BASE.loadKwh, oxygen: 0, food: 0, knowledge: 0 };
  const jobs: Record<string, Job> = {};
  for (const astronaut of state.crew) {
    const job = doableJob(state, astronaut, plan);
    jobs[astronaut.id] = job;
    if (job === 'rest') continue;
    const amount = jobYield(job, astronaut.specialty);
    totals.used += JOB_RULES[job].powerKwh;
    if (job === 'solar') totals.solar += amount;
    if (job === 'oxygen') totals.oxygen += amount;
    if (job === 'greenhouse') totals.food += amount;
    if (job === 'research') totals.knowledge += amount;
  }
  const solarKwh = (DEMO_DAYS[state.day - 1]?.solarKwh ?? 0) + totals.solar;
  return {
    jobs,
    solarKwh,
    usedKwh: totals.used,
    batteryAfterKwh: state.batteryKwh + solarKwh - totals.used,
    oxygenMadeKg: totals.oxygen,
    foodPlantedKg: totals.food,
    knowledge: totals.knowledge,
  };
};

/** Whether the plan can be played: the battery must not run dry, and the storm needs an answer. */
export const planProblem = (state: BaseState, plan: DayPlan): 'power' | 'storm' | undefined => {
  if (DEMO_DAYS[state.day - 1]?.event === 'storm' && !plan.storm) return 'storm';
  return planEffects(state, plan).batteryAfterKwh < 0 ? 'power' : undefined;
};
