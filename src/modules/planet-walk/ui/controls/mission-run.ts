import type { DrumRates } from '../../core/excavator/excavator-power';
import type { createExcavatorDriving } from './excavator-driving';
import type { createStationActions } from './station-actions';

/** What the excavator mission measured when it ended. */
export type MissionRunReport = {
  deliveredKg: number;
  secondsOutside: number;
  robotKwhUsed: number;
  rescued: number;
};

/** The excavator mission as packed in the bag, and what to do when it ends. */
export type MissionPlan = {
  drums: DrumRates;
  extraKwh: number;
  goalKg: number;
  onEnd: (report: MissionRunReport) => void;
};

/**
 * Runs the excavator mission: starts at the robot's controls with the packed drums and batteries,
 * shows the regolith delivered, and ends once, when the player finishes, leaves the robot, the
 * battery runs out, or the crew has to bring the astronaut back.
 */
export const createMissionRun = (
  plan: MissionPlan,
  hud: HTMLElement,
  finish: HTMLButtonElement,
  driving: ReturnType<typeof createExcavatorDriving>,
  actions: ReturnType<typeof createStationActions>,
) => {
  driving.equip(plan.drums, plan.extraKwh);
  actions.takeExcavator();
  const startKwh = driving.store().batteryKwh;
  let secondsOutside = 0;
  let ended = false;
  let finished = false;
  finish.hidden = false;
  finish.addEventListener('click', () => (finished = true));
  hud.hidden = false;
  return {
    update: (seconds: number, outside: boolean, rescued: boolean) => {
      if (ended) return;
      if (outside) secondsOutside += seconds;
      const { deliveredKg, batteryKwh } = driving.store();
      hud.textContent = `Mission · regolith delivered ${Math.floor(deliveredKg)} / ${plan.goalKg} kg`;
      if (!finished && !rescued && actions.activity() === 'driving') return;
      ended = true;
      plan.onEnd({
        deliveredKg,
        secondsOutside,
        robotKwhUsed: startKwh - batteryKwh,
        rescued: rescued ? 1 : 0,
      });
    },
  };
};
