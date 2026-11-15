import type { Specialty } from './crew';

/** What an astronaut does for a day. */
export type Job = 'research' | 'greenhouse' | 'oxygen' | 'solar' | 'rest';

/** Jobs in the order the crew panel shows them. */
export const JOB_ORDER: readonly Job[] = ['research', 'greenhouse', 'oxygen', 'solar', 'rest'];

/**
 * What one astronaut-day of each job costs in power (kWh) and gives: knowledge points, food
 * (kg, harvested later), oxygen (kg), or extra solar power (kWh) by cleaning and turning the
 * panels. An expert gives the larger amount. Gameplay values, see DATA.md.
 */
export const JOB_RULES: Record<
  Exclude<Job, 'rest'>,
  { powerKwh: number; gives: number; expertGives: number; experts: readonly Specialty[] }
> = {
  research: { powerKwh: 40, gives: 8, expertGives: 12, experts: ['geology', 'physics'] },
  greenhouse: { powerKwh: 20, gives: 7, expertGives: 10, experts: ['biology'] },
  oxygen: { powerKwh: 30, gives: 5, expertGives: 7, experts: ['chemistry'] },
  solar: { powerKwh: 0, gives: 40, expertGives: 60, experts: ['engineering'] },
};

/** Days between planting in the greenhouse and eating what grew. */
export const GROW_DAYS = 2;

/** Returns what one day of the job gives when done by an astronaut of that specialty. */
export const jobYield = (job: Exclude<Job, 'rest'>, specialty: Specialty): number => {
  const rule = JOB_RULES[job];
  return rule.experts.includes(specialty) ? rule.expertGives : rule.gives;
};
