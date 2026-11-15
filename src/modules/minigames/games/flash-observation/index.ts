import { playFlashObservation } from './ui/game.view';
import type { MiniGame } from '../../core/minigame';

/** Flash Observation: look through the porthole for a few seconds, then answer a question. */
export const flashObservationGame: MiniGame = {
  id: 'flash-observation',
  title: 'Flash Observation',
  summary: 'Look through the porthole for 3 seconds, then answer a question about what you saw.',
  howTo: [
    'Look at the picture: it only stays for 3 seconds.',
    'Then answer the question about what you saw: how many, which one was missing, or which colour.',
  ],
  start: (container, finish) => playFlashObservation(container, finish, Math.random),
};
