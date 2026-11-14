import { startPrecisionBalance } from './ui/precision-balance.view';
import type { MiniGame } from '../../core/minigame';

/** Precision Balance: hang the weights on the cargo arm so that it stays level. */
export const precisionBalanceGame: MiniGame = {
  id: 'precision-balance',
  title: 'Precision Balance',
  summary: 'Hang the weights on the cargo arm so that it stays level.',
  start: startPrecisionBalance,
};
