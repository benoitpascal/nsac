import { startLiquidSort } from './ui/liquid-sort.view';
import type { MiniGame } from '../../core/minigame';

/** Liquid Sort: pour the lab's fuel samples until each tube holds one color. */
export const liquidSortGame: MiniGame = {
  id: 'liquid-sort',
  title: 'Liquid Sort',
  summary: 'Pour the fuel samples until each tube holds just one color.',
  howTo: [
    'Tap a tube, then another tube, to pour the top colour into it.',
    'You can only pour onto the same colour or into an empty tube.',
    'Finish when each tube holds a single colour.',
  ],
  start: (container, finish) => startLiquidSort(container, finish),
};
