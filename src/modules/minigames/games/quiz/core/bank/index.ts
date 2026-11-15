import { MISSION_QUESTIONS } from './missions';
import { PLANET_QUESTIONS } from './planets';
import { SUN_MOON_QUESTIONS } from './sun-moon';
import type { Question } from './question';

export type { Question } from './question';

/** Every question of the astronaut exam. */
export const QUESTION_BANK: readonly Question[] = [
  ...PLANET_QUESTIONS,
  ...SUN_MOON_QUESTIONS,
  ...MISSION_QUESTIONS,
];
