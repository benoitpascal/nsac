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
};

/**
 * Runs the excavator mission, driven by remote control from inside the base: starts at the robot's
 * controls, shows the regolith delivered, and ends once, when the player finishes, leaves the robot, the
 * battery runs out, or the crew has to bring the astronaut back.
 */
export const createMissionRun = (
  plan: MissionPlan,
  hud: HTMLElement,
  finish: HTMLButtonElement,
  driving: ReturnType<typeof createExcavatorDriving>,
  actions: ReturnType<typeof createStationActions>,
) => {
  actions.takeExcavator();
  const startKwh = driving.store().batteryKwh;
  let ended = false;
  let finished = false;
  finish.hidden = false;
  finish.addEventListener('click', () => (finished = true));
  hud.hidden = false;
  return {
    update: (rescued: boolean) => {
      if (ended) return;
      const { deliveredKg, batteryKwh } = driving.store();
      hud.textContent = `Mission · regolith delivered ${Math.floor(deliveredKg)} / ${plan.goalKg} kg`;
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
