import '../flash-observation.css';
import { answerRound, currentRound, gameResult, startGame } from '../core/game';
import { showGetReady, showPicture } from './picture.view';
import { showProgress } from './progress.view';
import { markAnswer, showQuestion } from './question.view';
import type { MiniGameResult, StopGame } from '../../../core/minigame';
import type { Round } from '../core/game';
import type { Random } from '../core/random';

/** How long (ms) the "Look!" message, the picture and the answer feedback stay on screen. */
const READY_MS = 1000;
const LOOK_MS = 3000;
const FEEDBACK_MS = 1600;

const element = (className: string) => {
  const created = document.createElement('div');
  created.className = className;
  return created;
};

/**
 * Plays six rounds: show a picture for a few seconds, hide it, ask one question answered with
 * a click, a tap or keys 1 to 4. Calls finish once after the last round.
 */
export const playFlashObservation = (
  container: HTMLElement,
  finish: (result: MiniGameResult) => void,
  random: Random,
): StopGame => {
  let game = startGame(random);
  let timer: number | undefined;
  let pickByKey: ((index: number) => void) | undefined;
  const progress = element('mg-flash-observation-progress');
  const stage = element('mg-flash-observation-stage');
  const root = element('mg-flash-observation');
  root.append(progress, stage);
  container.replaceChildren(root);
  const later = (delayMs: number, action: () => void) => {
    timer = window.setTimeout(action, delayMs);
  };
  const ask = (round: Round) => {
    const pick = (index: number) => {
      pickByKey = undefined;
      game = answerRound(game, index);
      markAnswer(buttons, round.question.answer, index);
      showProgress(progress, game);
      later(FEEDBACK_MS, nextRound);
    };
    const buttons = showQuestion(stage, round.question, pick);
    pickByKey = (index) => {
      if (index >= 0 && index < buttons.length) pick(index);
    };
  };
  const nextRound = () => {
    const round = currentRound(game);
    if (!round) {
      finish(gameResult(game));
      return;
    }
    showProgress(progress, game);
    showGetReady(stage);
    later(READY_MS, () => {
      showPicture(stage, round.picture.items, LOOK_MS);
      later(LOOK_MS, () => ask(round));
    });
  };
  const onKey = (event: KeyboardEvent) => pickByKey?.(Number(event.key) - 1);
  window.addEventListener('keydown', onKey);
  nextRound();
  return () => {
    window.clearTimeout(timer);
    window.removeEventListener('keydown', onKey);
  };
};
