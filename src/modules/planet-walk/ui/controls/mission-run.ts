import { insideZone } from '../../core/excavator/ground-zone';
import { excavatorGoals } from '../../core/hud/excavator-goals';
import { createMissionRadio } from '../radio/mission-radio';
import { createGoalList } from './goal-list';
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
  const show = createGoalList(hud);
  let reachedDigZone = false;
  let doneCount = 0;
  const speakUp = createMissionRadio(radio, driving, plan.goalKg);
  const render = () => {
    const { carriedKg, deliveredKg } = driving.store();
    reachedDigZone ||= insideZone(digZone, driving.vehicle());
    const goals = excavatorGoals({ reachedDigZone, carriedKg, deliveredKg, goalKg: plan.goalKg });
    const done = goals.filter((goal) => goal.done).length;
    if (done > doneCount) plan.onGoalDone?.();
    doneCount = done;
    show(goals);
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
