import { insideZone } from '../../core/excavator/ground-zone';
import { excavatorGoals } from '../../core/hud/excavator-goals';
import { createMissionRadio } from '../radio/mission-radio';
import type { RadioMessage } from '../radio/radio-message';
import type { GroundZone } from '../../core/excavator/ground-zone';
import type { createExcavatorDriving } from './excavator-driving';
import type { createStationActions } from './station-actions';

/** What the excavator mission measured when it ended. */
export type MissionRunReport = {
  deliveredKg: number;
  robotKwhUsed: number;
  rescued: number;
};

/** The excavator mission and what to do when it ends. */
export type MissionPlan = {
  goalKg: number;
  onEnd: (report: MissionRunReport) => void;
  /** Called each time one more of today's goals is ticked. */
  onGoalDone?: () => void;
};

/**
 * Runs the excavator mission, driven by remote control from inside the base: starts at the robot's
 * controls, ticks the HUD's « today's goal » checklist, has the base say on the radio when enough
 * regolith is dug and when it is all dropped off, and ends once, when the player finishes, leaves the robot, the
 * battery runs out, or the crew has to bring the astronaut back.
 */
export const createMissionRun = (
  plan: MissionPlan,
  radio: RadioMessage,
  hud: HTMLElement,
  finish: HTMLButtonElement,
  driving: ReturnType<typeof createExcavatorDriving>,
  actions: ReturnType<typeof createStationActions>,
  digZone: GroundZone,
) => {
  actions.takeExcavator();
  const startKwh = driving.store().batteryKwh;
  let ended = false;
  let finished = false;
  finish.hidden = false;
  finish.addEventListener('click', () => (finished = true));
  hud.hidden = false;
  const list = hud.querySelector<HTMLElement>('.walk-goals__list');
  let reachedDigZone = false;
  let shown = '';
  let doneCount = 0;
  const speakUp = createMissionRadio(radio, driving, plan.goalKg);
  const render = () => {
    const { carriedKg, deliveredKg } = driving.store();
    reachedDigZone ||= insideZone(digZone, driving.vehicle());
    const goals = excavatorGoals({ reachedDigZone, carriedKg, deliveredKg, goalKg: plan.goalKg });
    const key = goals.map((goal) => `${goal.done}${goal.label}`).join('|');
    if (!list || key === shown) return;
    shown = key;
    const done = goals.filter((goal) => goal.done).length;
    if (done > doneCount) plan.onGoalDone?.();
    doneCount = done;
    list.replaceChildren(
      ...goals.map((goal) => {
        const item = document.createElement('li');
        item.className = goal.done ? 'walk-goals__item walk-goals__item--done' : 'walk-goals__item';
        item.textContent = goal.label;
        return item;
      }),
    );
  };
  return {
    update: (rescued: boolean) => {
      if (ended) return;
      render();
      speakUp();
      const { deliveredKg, batteryKwh } = driving.store();
      if (!finished && !rescued && actions.activity() === 'driving') return;
      ended = true;
      plan.onEnd({
        deliveredKg,
        robotKwhUsed: startKwh - batteryKwh,
        rescued: rescued ? 1 : 0,
      });
    },
  };
};
