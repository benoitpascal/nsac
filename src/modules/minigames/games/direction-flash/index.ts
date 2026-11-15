import { startFlight } from './ui/flight';
import type { MiniGame } from '../../core/minigame';

/** Direction Flash: steer the rover through the asteroids by following the co-pilot's arrows. */
export const directionFlashGame: MiniGame = {
  id: 'direction-flash',
  title: 'Direction Flash',
  summary: 'Press the arrow the co-pilot shows, or the opposite one when it turns orange!',
  howTo: [
    'An arrow appears: press the same direction (arrow keys, W A S D or the buttons).',
    'When the arrow is orange, press the opposite direction.',
    'Answer before the bar empties. A wrong or late answer costs a shield.',
  ],
  start: startFlight,
};
