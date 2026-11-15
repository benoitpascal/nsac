import { BASE } from './base-state';
import { DEMO_DAYS } from './demo-days';
import type { BaseState } from './base-state';

/**
 * Where the act stands after a day: still going, out of oxygen or food (the crew flies home
 * safely), or, once the ship to Mars leaves after the last demo day, ready for Mars or not.
 */
export type ActOutcome = 'playing' | 'ready' | 'noOxygen' | 'noFood' | 'notReady';

/** Returns where the act stands on the morning after a played day. */
export const actOutcome = (state: BaseState): ActOutcome => {
  if (state.oxygenKg <= 0) return 'noOxygen';
  if (state.foodKg <= 0) return 'noFood';
  if (state.day <= DEMO_DAYS.length) return 'playing';
  return state.knowledge >= BASE.knowledgeForMars ? 'ready' : 'notReady';
};

/** How many days the oxygen and the food last if nothing more is made. */
export const daysLeft = (state: BaseState) => ({
  oxygen: Math.max(0, state.oxygenKg / BASE.oxygenPerDayKg),
  food: Math.max(0, state.foodKg / BASE.foodPerDayKg),
});
