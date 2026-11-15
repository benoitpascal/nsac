import { DEFAULT_DAYS_PER_SECOND } from './simulation-speeds';

/**
 * Simulated date (Unix timestamp in ms), whether it moves, which way,
 * and how many simulated days pass in one real second.
 */
export type SimulationClock = {
  timestamp: number;
  running: boolean;
  backwards: boolean;
  daysPerSecond: number;
};

const MS_PER_DAY = 86_400_000;

/** Dates covered by the orbit model (1800–2050); the clock stops at both ends. */
export const SIMULATION_RANGE = {
  start: Date.UTC(1800, 0, 1),
  end: Date.UTC(2050, 11, 31, 23, 59),
};

const clampToRange = (timestamp: number) =>
  Math.min(Math.max(timestamp, SIMULATION_RANGE.start), SIMULATION_RANGE.end);

/** Starts the simulation forwards on the given date at the default speed. */
export const startClock = (timestamp: number): SimulationClock => ({
  timestamp: clampToRange(timestamp),
  running: true,
  backwards: false,
  daysPerSecond: DEFAULT_DAYS_PER_SECOND,
});

/** Stops the simulation on the given date (kept within the range), showing the planets then. */
export const freezeClock = (clock: SimulationClock, timestamp: number): SimulationClock => ({
  ...clock,
  timestamp: clampToRange(timestamp),
  running: false,
});

/** Resumes the orbits from the current simulated date. */
export const resumeClock = (clock: SimulationClock): SimulationClock => ({
  ...clock,
  running: true,
});

/** Changes how many simulated days pass in one real second, keeping the current date. */
export const setClockSpeed = (clock: SimulationClock, daysPerSecond: number): SimulationClock => ({
  ...clock,
  daysPerSecond,
});

/** Makes time flow the other way, keeping the current date. */
export const reverseClock = (clock: SimulationClock): SimulationClock => ({
  ...clock,
  backwards: !clock.backwards,
});

/**
 * Returns the clock after the given real elapsed time; a frozen clock does not move.
 * The clock freezes when it reaches either end of the simulation range.
 */
export const advanceClock = (clock: SimulationClock, elapsedSeconds: number): SimulationClock => {
  if (!clock.running) return clock;
  const direction = clock.backwards ? -1 : 1;
  const next = clock.timestamp + direction * elapsedSeconds * clock.daysPerSecond * MS_PER_DAY;
  const timestamp = clampToRange(next);
  return { ...clock, timestamp, running: timestamp === next };
};
