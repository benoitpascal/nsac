import { PROMPT_COUNT } from '../core/rules';
import type { Prompt } from '../core/prompt';
import type { Tally } from '../core/tally';
import type { Board } from './board.view';

const POP_MS = 160;
const POP_FROM_SCALE = 0.5;

/** Empties the time bar as the fraction of time left goes from 1 to 0. */
export const showTimeLeft = (board: Board, fraction: number) => {
  board.timerFill.style.transform = `scaleX(${Math.min(1, Math.max(0, fraction))})`;
};

/** Pops the arrow of a new prompt, cyan or orange when swapped, with a full time bar. */
export const showPrompt = (board: Board, prompt: Prompt) => {
  board.stage.dataset.state = 'ask';
  board.sign.dataset.swapped = String(prompt.swapped);
  board.arrow.dataset.direction = prompt.direction;
  board.sign.animate([{ transform: `scale(${POP_FROM_SCALE})` }, { transform: 'scale(1)' }], {
    duration: POP_MS,
    easing: 'ease-out',
  });
  showTimeLeft(board, 1);
};

/** Flashes the screen green for a right answer, red for a wrong or late one. */
export const showFeedback = (board: Board, hit: boolean) => {
  board.stage.dataset.state = hit ? 'hit' : 'miss';
};

/** Shows the shields left and how many prompts were answered. */
export const showTally = (board: Board, tally: Tally) => {
  board.shields.forEach((shield, index) => {
    shield.dataset.lost = String(index >= tally.shields);
  });
  board.progress.textContent = `${tally.asked} / ${PROMPT_COUNT}`;
};
