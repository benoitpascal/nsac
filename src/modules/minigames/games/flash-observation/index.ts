import { playFlashObservation } from './ui/game.view';
import type { MiniGame } from '../../core/minigame';

/** Flash Observation: look through the porthole for a few seconds, then answer a question. */
export const flashObservationGame: MiniGame = {
  id: 'flash-observation',
  title: 'Flash Observation',
  summary: 'Look through the porthole for 3 seconds, then answer a question about what you saw.',
  start: (container, finish) => playFlashObservation(container, finish, Math.random),
};
