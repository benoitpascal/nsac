import { dayOneObjectives, dayOneOutcome } from '../../core/mission/day-one';
import { hasCharge } from '../../core/excavator/excavator-power';
import { createMissionPanel } from './mission-panel';
import { showMissionEnding } from './mission-ending';
import type { ExcavatorStore } from '../../core/excavator/excavator-power';
import type { Activity } from '../../core/station/station-actions';

/** What the mission reads from the running walk. */
export type MissionWalk = { excavator: () => ExcavatorStore; activity: () => Activity };

/** Called once when the day ends, with the regolith brought to the base (kg). */
export type MissionEnd = (deliveredKg: number) => void;

export type MissionElements = {
  panel: HTMLElement;
  ending: HTMLDialogElement;
  worldPicker: HTMLElement;
  backLink: HTMLAnchorElement;
};

/**
 * Turns the free walk into the day one mission of the briefing: the walk stays on the Moon, the
 * goals panel follows the regolith dropped off and the oxygen check at the terminal, and the day
 * ends once every goal is met, or when the robot's battery runs out before the target.
 */
export const startDayOneMission = (
  walk: MissionWalk,
  elements: MissionElements,
  onEnd: MissionEnd,
) => {
  elements.worldPicker.hidden = true;
  elements.backLink.href = '/briefing.html';
  elements.backLink.textContent = 'Briefing';
  const showObjectives = createMissionPanel(elements.panel);
  let checkedOxygen = false;
  const tick = () => {
    checkedOxygen ||= walk.activity() === 'dashboard';
    const store = walk.excavator();
    const inputs = {
      deliveredKg: store.deliveredKg,
      robotCharged: hasCharge(store),
      checkedOxygen,
    };
    showObjectives(dayOneObjectives(inputs));
    const outcome = dayOneOutcome(inputs);
    if (outcome === 'playing') requestAnimationFrame(tick);
    else {
      onEnd(store.deliveredKg);
      showMissionEnding(elements.ending, outcome, store.deliveredKg);
    }
  };
  tick();
};
