import { startDefuse } from './ui/defuse.view';
import type { MiniGame } from '../../core/minigame';

/** Defuse: solve three panels before the reactor overheats. */
export const defuseGame: MiniGame = {
  id: 'defuse',
  title: 'Defuse',
  summary: 'Fix three panels quickly to cool down the overheating reactor!',
  howTo: [
    'Solve the three panels before the countdown runs out.',
    'Each panel tells you what to do: press the numbers from smallest to biggest, cut the wire the card points to, or pick the picture that matches.',
    'A mistake takes away some time.',
  ],
  start: (container, finish) =>
    startDefuse(container, finish, { random: Math.random, now: () => performance.now() }),
};
