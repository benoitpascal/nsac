import { startLightMemory } from './ui/light-memory.view';
import type { MiniGame } from '../../core/minigame';

/** Light Memory: watch the station's signal lights, then repeat them in the same order. */
export const lightMemoryGame: MiniGame = {
  id: 'light-memory',
  title: 'Light Memory',
  summary: 'Watch the lights, then repeat them in the same order.',
  howTo: [
    'Watch the lights flash one after another.',
    'Repeat them in the same order: tap them, or use keys 1 to 4 or the arrows.',
    'Each round adds one more light.',
  ],
  start: (container, finish) => startLightMemory(container, finish, Math.random),
};
