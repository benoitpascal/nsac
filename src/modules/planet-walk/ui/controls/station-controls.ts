import { createStationDashboard } from '../dashboard/station-dashboard';
import { createCommandLegend } from './command-legend';
import { createExcavatorDriving } from './excavator-driving';
import { createExcavatorHud } from './excavator-hud';
import { createStationActions } from './station-actions';
import type { StartSpot } from '../../core/station/station-actions';
import type { Spot } from '../../core/obstacles';
import type { WalkWorldId } from '../../core/walk-worlds';
import type { createWalkScene } from '../walk-scene';

export type StationControlElements = {
  commandLegend: HTMLElement;
  /** The on-screen button that opens the tablet. */
  tablet?: HTMLElement;
  dashboard: HTMLElement;
  excavatorHud: HTMLElement;
};

/**
 * Builds what the astronaut uses in the base: the action key and the command legend, the excavator robot
 * with its on-screen readout, and the station dashboard of the chosen world.
 */
export const createStationControls = (
  world: ReturnType<typeof createWalkScene>,
  elements: StationControlElements,
  worldId: () => WalkWorldId,
  now: () => number,
  openTerminal: (from?: StartSpot) => void,
  /** Where today's mission sends the astronaut, and what the action key starts there. */
  errand?: { place: Spot; start: () => void },
) => {
  const spots = errand ? { ...world.stationSpots, errand: errand.place } : world.stationSpots;
  const actions = createStationActions(spots, openTerminal, elements.tablet, errand?.start);
  const driving = createExcavatorDriving(world);
  const dashboard = createStationDashboard({
    section: elements.dashboard,
    actions,
    worldId,
    now,
    excavator: driving.store,
  });
  return {
    actions,
    driving,
    dashboard,
    hud: createExcavatorHud(elements.excavatorHud, driving),
    legend: createCommandLegend(elements.commandLegend, actions.press),
  };
};
