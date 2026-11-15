import { startPowerGrid } from './ui/power-grid.view';
import type { MiniGame } from '../../core/minigame';

/** Power Grid: restore the station's power by linking each socket to its twin with a cable. */
export const powerGridGame: MiniGame = {
  id: 'power-grid',
  title: 'Power Grid',
  summary: 'Link each power socket to the one of the same color and fill every square.',
  start: startPowerGrid,
};
