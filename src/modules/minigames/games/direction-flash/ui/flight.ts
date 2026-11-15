import '../direction-flash.css';
import { createPrompt, judgeAnswer, MISSED } from '../core/prompt';
import { flightResult, isFlightOver, recordAnswer, startTally } from '../core/tally';
import { showFeedback, showPrompt, showTally, showTimeLeft } from './board.render';
import { buildBoard } from './board.view';
import { listenToDirectionKeys } from './keyboard';
import type { MiniGameResult, StopGame } from '../../../core/minigame';
import type { Direction } from '../core/directions';
import type { Answer, Prompt } from '../core/prompt';

const READY_MS = 900;
const FEEDBACK_MS = 450;

/** Runs a flight in the container and calls finish once when it ends. */
export const startFlight = (
  container: HTMLElement,
  finish: (result: MiniGameResult) => void,
): StopGame => {
  let tally = startTally();
  let prompt: Prompt | undefined;
  let shownAt = 0;
  let frame = 0;
  let pause = 0;

  const answer = (direction: Direction) => {
    if (prompt) settle(judgeAnswer(prompt, direction, performance.now() - shownAt));
  };
  const board = buildBoard(container, answer);
  const stopKeys = listenToDirectionKeys(window, answer);
  const stop = () => {
    cancelAnimationFrame(frame);
    clearTimeout(pause);
    stopKeys();
  };

  const tick = (now: number) => {
    if (!prompt) return;
    const elapsed = now - shownAt;
    showTimeLeft(board, 1 - elapsed / prompt.limitMs);
    if (elapsed >= prompt.limitMs) settle(MISSED);
    else frame = requestAnimationFrame(tick);
  };
  const ask = () => {
    prompt = createPrompt(tally.asked, Math.random);
    shownAt = performance.now();
    showPrompt(board, prompt);
    frame = requestAnimationFrame(tick);
  };
  const settle = (result: Answer) => {
    prompt = undefined;
    cancelAnimationFrame(frame);
    tally = recordAnswer(tally, result);
    showTally(board, tally);
    showFeedback(board, result.hit);
    pause = window.setTimeout(isFlightOver(tally) ? end : ask, FEEDBACK_MS);
  };
  const end = () => {
    stop();
    finish(flightResult(tally));
  };

  showTally(board, tally);
  pause = window.setTimeout(ask, READY_MS);
  return stop;
};
