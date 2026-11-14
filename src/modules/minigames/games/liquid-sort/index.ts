import { startLiquidSort } from './ui/liquid-sort.view';
import type { MiniGame } from '../../core/minigame';

/** Liquid Sort: pour the lab's fuel samples until each tube holds one color. */
export const liquidSortGame: MiniGame = {
  id: 'liquid-sort',
  title: 'Liquid Sort',
  summary: 'Pour the fuel samples until each tube holds just one color.',
  start: (container, finish) => startLiquidSort(container, finish),
};
