export type SimulationSpeed = {
  label: string;
  daysPerSecond: number;
};

const SECONDS_PER_DAY = 86_400;
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;
const DAYS_PER_MONTH = 30;
const DAYS_PER_YEAR = 365.25;

/** Speeds the simulation can run at, from real time to one year per second. */
export const SIMULATION_SPEEDS: readonly SimulationSpeed[] = [
  { label: 'Real time', daysPerSecond: 1 / SECONDS_PER_DAY },
  { label: '1 hour / s', daysPerSecond: 1 / HOURS_PER_DAY },
  { label: '1 day / s', daysPerSecond: 1 },
  { label: '1 week / s', daysPerSecond: DAYS_PER_WEEK },
  { label: '1 month / s', daysPerSecond: DAYS_PER_MONTH },
  { label: '1 year / s', daysPerSecond: DAYS_PER_YEAR },
];

/** Speed the simulation starts at: one month per second. */
export const DEFAULT_DAYS_PER_SECOND = DAYS_PER_MONTH;
