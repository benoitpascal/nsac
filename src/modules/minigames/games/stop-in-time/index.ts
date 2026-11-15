import { startStopInTime } from './ui/game';
import type { MiniGame } from '../../core/minigame';

/** Stop in Time: stop the sliding shuttle inside the green docking zone. */
export const stopInTimeGame: MiniGame = {
  id: 'stop-in-time',
  title: 'Stop in Time',
  summary: 'Stop the moving shuttle inside the green zone to dock it.',
  start: startStopInTime,
};
