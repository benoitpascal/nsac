import { startPrecisionBalance } from './ui/precision-balance.view';
import { HINT_PENALTY } from './core/score';
import { WRONG_TRIES_BEFORE_HINT } from './core/help';
import type { MiniGame } from '../../core/minigame';

/** Precision Balance: hang the weights on the cargo arm so that it stays level. */
export const precisionBalanceGame: MiniGame = {
  id: 'precision-balance',
  title: 'Precision Balance',
  summary: 'Hang the weights on the cargo arm so that it stays level.',
  howTo: [
    'Drag an orange weight onto a hook of the arm (or tap the weight, then the hook). Grey weights cannot move.',
    'A weight far from the middle pulls harder than the same weight close to it.',
    'Hang every weight so the arm stays level: flat, not tilted.',
    `Stuck? Hang all the weights. If the arm still tilts ${WRONG_TRIES_BEFORE_HINT} times, a Hint button shows up. Each hint costs ${HINT_PENALTY} points.`,
  ],
  start: startPrecisionBalance,
};
