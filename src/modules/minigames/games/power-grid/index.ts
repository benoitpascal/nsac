import { startPowerGrid } from './ui/power-grid.view';
import type { MiniGame } from '../../core/minigame';

/** Power Grid: restore the station's power by linking each socket to its twin with a cable. */
export const powerGridGame: MiniGame = {
  id: 'power-grid',
  title: 'Power Grid',
  summary: 'Link each power socket to the one of the same color and fill every square.',
  howTo: [
    'Draw a cable from a socket to the other socket of the same colour.',
    'Link every pair of colours, and fill every square of the grid.',
    'Cables cannot cross.',
  ],
  start: startPowerGrid,
};
