/** What an astronaut is best at: it makes one kind of job give more. */
export type Specialty =
  | 'geology'
  | 'biology'
  | 'engineering'
  | 'physics'
  | 'chemistry'
  | 'piloting';

/** A crew member, and how tired they are (0 rested, MAX_FATIGUE exhausted). */
export type Astronaut = { id: string; name: string; specialty: Specialty; fatigue: number };

/** Fatigue at which an astronaut can only rest. */
export const MAX_FATIGUE = 4;

/** Fatigue a working day adds, and fatigue a day of rest takes away. */
export const FATIGUE = { work: 1, rest: 2 };

/** Whether the astronaut is too tired to work today. */
export const isExhausted = (astronaut: Astronaut): boolean => astronaut.fatigue >= MAX_FATIGUE;

/** The six astronauts of the Moon base (fictional), all rested at the start of the act. */
export const START_CREW: readonly Astronaut[] = [
  { id: 'ada', name: 'Ada', specialty: 'geology', fatigue: 0 },
  { id: 'bo', name: 'Bo', specialty: 'biology', fatigue: 0 },
  { id: 'cyril', name: 'Cyril', specialty: 'engineering', fatigue: 0 },
  { id: 'dina', name: 'Dina', specialty: 'physics', fatigue: 0 },
  { id: 'eli', name: 'Eli', specialty: 'chemistry', fatigue: 0 },
  { id: 'fatou', name: 'Fatou', specialty: 'piloting', fatigue: 0 },
];
