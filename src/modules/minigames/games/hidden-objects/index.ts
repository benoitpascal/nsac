import { playHiddenObjects } from './ui/hidden-objects.view';
import type { MiniGame } from '../../core/minigame';

/** Hidden Objects: find the lost tools in a messy station workshop before time runs out. */
export const hiddenObjectsGame: MiniGame = {
  id: 'hidden-objects',
  title: 'Hidden Objects',
  summary: 'Find the lost tools in the messy station workshop before time runs out.',
  start: (container, finish) => playHiddenObjects(container, finish, Math.random),
};
