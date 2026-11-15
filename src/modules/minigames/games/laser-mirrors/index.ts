import { startLaserMirrors } from './ui/game.view';
import type { MiniGame } from '../../core/minigame';

/** Laser Mirrors: flip the mirrors so the station's laser lights every receiver. */
export const laserMirrorsGame: MiniGame = {
  id: 'laser-mirrors',
  title: 'Laser Mirrors',
  summary: "Flip the mirrors so the station's laser lights up every receiver.",
  howTo: [
    'Tap a mirror to turn it the other way.',
    'Guide the laser beam so it passes through every round receiver (O).',
    'Try to use as few turns as possible.',
  ],
  start: startLaserMirrors,
};
