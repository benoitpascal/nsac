import { startLightMemory } from './ui/light-memory.view';
import type { MiniGame } from '../../core/minigame';

/** Light Memory: watch the station's signal lights, then repeat them in the same order. */
export const lightMemoryGame: MiniGame = {
  id: 'light-memory',
  title: 'Light Memory',
  summary: 'Watch the lights, then repeat them in the same order.',
  start: (container, finish) => startLightMemory(container, finish, Math.random),
};
