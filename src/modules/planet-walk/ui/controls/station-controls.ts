import { createStationDashboard } from '../dashboard/station-dashboard';
import { createExcavatorDriving } from './excavator-driving';
import { createExcavatorHud } from './excavator-hud';
import { createStationActions } from './station-actions';
import type { WalkWorldId } from '../../core/walk-worlds';
import type { BaseShares } from '../dashboard/dashboard-rows';
import type { createWalkScene } from '../walk-scene';

/** The base's time (Unix ms), and the demo's base stocks (%) when a campaign is running. */
export type StationSources = { now: () => number; baseShares?: () => BaseShares | undefined };

export type StationControlElements = {
  pilotPrompt: HTMLButtonElement;
  dashboard: HTMLElement;
  excavatorHud: HTMLElement;
};

/**
 * Builds what the astronaut uses in the base: the action key and its prompt, the excavator robot
 * with its on-screen readout, and the station dashboard of the chosen world.
 */
export const createStationControls = (
  world: ReturnType<typeof createWalkScene>,
  elements: StationControlElements,
  worldId: () => WalkWorldId,
  sources: StationSources,
) => {
  const actions = createStationActions(world.stationSpots, elements.pilotPrompt);
  const driving = createExcavatorDriving(world);
  const dashboard = createStationDashboard({
    section: elements.dashboard,
    actions,
    worldId,
    now: sources.now,
    excavator: driving.store,
    baseShares: sources.baseShares,
  });
  return { actions, driving, dashboard, hud: createExcavatorHud(elements.excavatorHud, driving) };
};
