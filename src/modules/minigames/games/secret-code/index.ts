import { startSecretCode } from './ui/secret-code.view';
import type { MiniGame } from '../../core/minigame';

/** Secret Code: find the 4-symbol code that opens the airlock. */
export const secretCodeGame: MiniGame = {
  id: 'secret-code',
  title: 'Secret Code',
  summary: 'Find the 4-symbol code that opens the airlock.',
  howTo: [
    'Guess the 4 symbols of the code, all different.',
    'After each try, the clues tell you how many symbols are in the right place, and how many are in the code but in the wrong place.',
    'Find the code before you run out of tries.',
  ],
  start: startSecretCode,
};
