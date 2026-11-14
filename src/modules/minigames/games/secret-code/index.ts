import { startSecretCode } from './ui/secret-code.view';
import type { MiniGame } from '../../core/minigame';

/** Secret Code: find the 4-symbol code that opens the airlock. */
export const secretCodeGame: MiniGame = {
  id: 'secret-code',
  title: 'Secret Code',
  summary: 'Find the 4-symbol code that opens the airlock.',
  start: startSecretCode,
};
