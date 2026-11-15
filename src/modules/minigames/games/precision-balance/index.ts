import { startPrecisionBalance } from './ui/precision-balance.view';
import type { MiniGame } from '../../core/minigame';

/** Precision Balance: hang the weights on the cargo arm so that it stays level. */
export const precisionBalanceGame: MiniGame = {
  id: 'precision-balance',
  title: 'Precision Balance',
  summary: 'Hang the weights on the cargo arm so that it stays level.',
  howTo: [
    'Drag a weight onto a hook of the arm (or tap the weight, then the hook).',
    'A weight far from the middle pulls harder than the same weight close to it.',
    'Hang every weight so the arm stays level.',
  ],
  start: startPrecisionBalance,
};
