import { startStopInTime } from './ui/game';
import type { MiniGame } from '../../core/minigame';

/** Stop in Time: stop the sliding shuttle inside the green docking zone. */
export const stopInTimeGame: MiniGame = {
  id: 'stop-in-time',
  title: 'Stop in Time',
  summary: 'Stop the moving shuttle inside the green zone to dock it.',
  howTo: [
    'The shuttle slides back and forth along the bar.',
    'Press STOP (or the space bar) when it is inside the green zone.',
    'Dock 5 times before missing 3 times. The zone gets smaller and faster.',
  ],
  start: startStopInTime,
};
