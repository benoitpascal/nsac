import { greenhouseGoals } from '../../core/hud/greenhouse-goals';
import { ERRAND_REACH_M } from '../../core/station/station-actions';
import { ERRAND_LINES } from '../../core/radio/base-radio-lines';
import { createGoalList } from './goal-list';
import type { Spot } from '../../core/obstacles';
import type { RadioMessage } from '../radio/radio-message';
import type { createStationActions } from './station-actions';

/** Lets the base appear before the radio sends the astronaut out (ms). */
const RADIO_DELAY_MS = 1500;

/**
 * Runs the greenhouse errand: the base sends the astronaut out on the radio, and the HUD's
 * « today's goal » checklist ticks going out and reaching the dome. The action key at the dome
 * (see the station actions) then starts the mini-game.
 */
export const createErrandRun = (
  radio: RadioMessage,
  hud: HTMLElement,
  actions: ReturnType<typeof createStationActions>,
  place: Spot,
  /** Plays the chime of a goal reached. */
  onGoalDone?: () => void,
) => {
  hud.hidden = false;
  const show = createGoalList(hud);
  window.setTimeout(() => radio.say('📻 Radio · Base', ERRAND_LINES), RADIO_DELAY_MS);
  let reached = false;
  let doneCount = 0;
  return {
    update: (walker: Spot) => {
      reached ||= Math.hypot(walker.x - place.x, walker.z - place.z) <= ERRAND_REACH_M;
      const goals = greenhouseGoals({ wentOut: actions.leftBase(), reached });
      const done = goals.filter((goal) => goal.done).length;
      if (done > doneCount) onGoalDone?.();
      doneCount = done;
      show(goals);
    },
  };
};
