import { stationReadings, solarPowerKw } from '../../core/station/readings';
import { startStores, stepStores } from '../../core/station/resources';
import { hasCharge } from '../../core/excavator/excavator-power';
import { dashboardRows, excavatorRows } from './dashboard-rows';
import type { ExcavatorStore } from '../../core/excavator/excavator-power';
import type { WalkWorldId } from '../../core/walk-worlds';
import type { createStationActions } from '../controls/station-actions';
import type { DashboardRow } from './dashboard-rows';
import { requireChild } from '@/shared/dom';

export type StationDashboardSetup = {
  section: HTMLElement;
  actions: ReturnType<typeof createStationActions>;
  worldId: () => WalkWorldId;
  /** The base's time (Unix ms), shared with the sky. */
  now: () => number;
  excavator: () => ExcavatorStore;
};

/** How often (s) the open dashboard refreshes its numbers. */
const REFRESH_SECONDS = 0.25;
const DRIVE_LABELS = { ready: 'Drive the excavator', empty: 'Excavator battery empty' };

const rowElements = ({ label, value }: DashboardRow) => {
  const term = document.createElement('dt');
  term.textContent = label;
  const detail = document.createElement('dd');
  detail.textContent = value;
  return [term, detail];
};

/**
 * Keeps the station's stores running on the chosen world (the crew breathes and drinks, the solar
 * panels charge the battery, digging draws water from the ground), and shows them on the dashboard
 * while it is open with the excavator robot's battery and dug regolith, with its close and "drive the
 * excavator" buttons, the latter disabled once the robot's battery is empty.
 */
export const createStationDashboard = (setup: StationDashboardSetup) => {
  const list = requireChild<HTMLElement>(setup.section, '.station-dashboard__readings');
  requireChild<HTMLButtonElement>(setup.section, '.station-dashboard__close').addEventListener(
    'click',
    setup.actions.closeDashboard,
  );
  const drive = requireChild<HTMLButtonElement>(setup.section, '.station-dashboard__drive');
  drive.addEventListener('click', setup.actions.driveExcavator);
  let stores = startStores();
  let sinceRefresh = REFRESH_SECONDS;
  return {
    update: (seconds: number, digging: boolean) => {
      const now = setup.now();
      const generationKw = solarPowerKw(setup.worldId(), now);
      stores = stepStores(stores, { generationKw, digging }, seconds);
      const open = setup.actions.activity() === 'dashboard';
      setup.section.hidden = !open;
      sinceRefresh = open ? sinceRefresh + seconds : REFRESH_SECONDS;
      if (!open || sinceRefresh < REFRESH_SECONDS) return;
      sinceRefresh = 0;
      const excavator = setup.excavator();
      const rows = [
        ...dashboardRows(stationReadings(setup.worldId(), now, stores)),
        ...excavatorRows(excavator),
      ];
      list.replaceChildren(...rows.flatMap(rowElements));
      drive.disabled = !hasCharge(excavator);
      drive.textContent = drive.disabled ? DRIVE_LABELS.empty : DRIVE_LABELS.ready;
    },
  };
};
