import { startDefuse } from './ui/defuse.view';
import type { MiniGame } from '../../core/minigame';

/** Defuse: solve three panels before the reactor overheats. */
export const defuseGame: MiniGame = {
  id: 'defuse',
  title: 'Defuse',
  summary: 'Fix three panels quickly to cool down the overheating reactor!',
  start: (container, finish) =>
    startDefuse(container, finish, { random: Math.random, now: () => performance.now() }),
};
