import type { Goal } from './excavator-goals';

/** What the greenhouse errand has reached so far. */
export type GreenhouseProgress = {
  /** Whether the astronaut went out through the airlock. */
  wentOut: boolean;
  /** Whether the astronaut reached the greenhouse dome. */
  reached: boolean;
};

/**
 * The three steps of the greenhouse mission, as on the « today's goal » checklist: go out, walk to
 * the dome lit by its green beam, and start the watering there (which opens the mini-game).
 */
export const greenhouseGoals = ({ wentOut, reached }: GreenhouseProgress): Goal[] => [
  { label: 'Go out through the airlock', done: wentOut || reached },
  { label: 'Walk to the glass dome (green light)', done: reached },
  { label: 'Press E to set up the watering', done: false },
];
