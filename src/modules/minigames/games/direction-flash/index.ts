import { startFlight } from './ui/flight';
import type { MiniGame } from '../../core/minigame';

/** Direction Flash: steer the rover through the asteroids by following the co-pilot's arrows. */
export const directionFlashGame: MiniGame = {
  id: 'direction-flash',
  title: 'Direction Flash',
  summary: 'Press the arrow the co-pilot shows, or the opposite one when it turns orange!',
  start: startFlight,
};
