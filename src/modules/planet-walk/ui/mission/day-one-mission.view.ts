import { dayOneObjectives, dayOneOutcome } from '../../core/mission/day-one';
import { hasCharge } from '../../core/excavator/excavator-power';
import { createMissionPanel } from './mission-panel';
import { showMissionEnding } from './mission-ending';
import type { ExcavatorStore } from '../../core/excavator/excavator-power';
import type { Activity } from '../../core/station/station-actions';

/** What the mission reads from the running walk. */
export type MissionWalk = { excavator: () => ExcavatorStore; activity: () => Activity };

/** Called once when the mission ends: regolith brought to the base (kg), and whether the robot is stuck. */
export type MissionEnd = (deliveredKg: number, stranded: boolean) => void;

export type MissionElements = {
  panel: HTMLElement;
  ending: HTMLDialogElement;
  worldPicker: HTMLElement;
  backLink: HTMLAnchorElement;
};

/**
 * Turns the free walk into the day one mission of the briefing: the walk stays on the Moon, the
 * goals panel follows the regolith dug and brought back, and the mission ends once enough is back
 * at the base, or when the robot's battery runs out before that.
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
  const tick = () => {
    const store = walk.excavator();
    const inputs = {
      carriedKg: store.carriedKg,
      deliveredKg: store.deliveredKg,
      robotCharged: hasCharge(store),
    };
    showObjectives(dayOneObjectives(inputs));
    const outcome = dayOneOutcome(inputs);
    if (outcome === 'playing') requestAnimationFrame(tick);
    else {
      onEnd(store.deliveredKg, outcome === 'stranded');
      showMissionEnding(elements.ending, outcome, store.deliveredKg);
    }
  };
  tick();
};
