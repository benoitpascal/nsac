import { BASE } from '../core/base-state';
import type { ActOutcome } from '../core/act-outcome';
import type { BaseState } from '../core/base-state';

/** What the end of the act says: what happened, why, what would have helped, and a real fact. */
export type ActEndText = { title: string; story: string; tip?: string };

const lastDay = (state: BaseState) => state.day - 1;

/** The real fact told at the end of every act, with its source. */
export const REAL_FACT = {
  text: 'In real life, the Apollo 17 astronauts stayed about 75 hours on the Moon, in 1972. A 30-day base would be a first.',
  url: 'https://www.nasa.gov/mission/apollo-17/',
};

export const ACT_END_TEXTS: Record<
  Exclude<ActOutcome, 'playing'>,
  (state: BaseState) => ActEndText
> = {
  ready: (state) => ({
    title: 'Ready for Mars!',
    story: `Your crew learned ${state.knowledge} points: enough to get ready for Mars. Great command!`,
  }),
  notReady: (state) => ({
    title: 'Not ready for Mars yet',
    story: `Your crew learned ${state.knowledge} of the ${BASE.knowledgeForMars} points needed, and everyone is safe.`,
    tip: 'Let astronauts rest in turns, and send the engineer to the solar panels: more power means more lab work.',
  }),
  noOxygen: (state) => ({
    title: 'The crew flies home early',
    story: `The oxygen ran low on day ${lastDay(state)}, so the crew flew safely back to Earth. They still learned ${state.knowledge} points for Mars.`,
    tip: 'The oxygen machine turns power into oxygen. One day of the chemist there would have been enough.',
  }),
  noFood: (state) => ({
    title: 'The crew flies home early',
    story: `The food ran low on day ${lastDay(state)}, so the crew flew safely back to Earth. They still learned ${state.knowledge} points for Mars.`,
    tip: 'Plants take 2 days to grow. One day in the greenhouse before day 4 would have been enough.',
  }),
};
