import { playReflexes } from './ui/play-reflexes';
import type { MiniGame } from '../../core/minigame';

/** Reflexes: wait for the launch light to turn green, then press as fast as possible. */
export const reflexesGame: MiniGame = {
  id: 'reflexes',
  title: 'Reflexes',
  summary: 'Wait for the light to turn green, then tap as fast as you can!',
  howTo: [
    'Wait while the light is red.',
    'As soon as it turns green, press as fast as you can.',
    'Pressing too early does not count.',
  ],
  start: (container, finish) =>
    playReflexes(container, finish, { now: () => performance.now(), random: Math.random }),
};
