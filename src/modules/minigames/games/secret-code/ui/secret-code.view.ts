import '../secret-code.css';
import { createCode } from '../core/code';
import { addSymbol, removeSymbol, scoreOf, startGame, submitGuess } from '../core/game';
import { renderAirlock } from './airlock.view';
import { renderBoard } from './board.view';
import { createElement } from './element';
import { createKeypad } from './keypad.view';
import { listenKeyboard } from './keyboard-input';
import { createLegend } from './legend.view';
import type { PlayerActions } from './actions';
import type { MiniGameResult, StopGame } from '../../../core/minigame';
import type { GameState } from '../core/game';

/** Time (ms) to look at the opened or revealed code before the result shows. */
const END_PAUSE_MS = 1500;

/** Plays a game of Secret Code inside the container and reports its result once. */
export const startSecretCode = (
  container: HTMLElement,
  finish: (result: MiniGameResult) => void,
): StopGame => {
  let state = startGame(createCode());
  let endTimer: number | undefined;
  const root = createElement('div', 'mg-secret-code');
  const airlock = createElement('div', 'mg-secret-code-airlock');
  const board = createElement('ol', 'mg-secret-code-board');
  const update = (next: GameState) => {
    const ended = state.status === 'playing' && next.status !== 'playing';
    state = next;
    renderAirlock(airlock, state);
    renderBoard(board, state);
    keypad.update(state);
    if (!ended) return;
    const result = { won: state.status === 'won', score: scoreOf(state) };
    endTimer = window.setTimeout(() => finish(result), END_PAUSE_MS);
  };
  const actions: PlayerActions = {
    add: (symbol) => update(addSymbol(state, symbol)),
    remove: () => update(removeSymbol(state)),
    submit: () => update(submitGuess(state)),
  };
  const keypad = createKeypad(actions);
  const controls = createElement('div', 'mg-secret-code-controls');
  controls.append(keypad.element, createLegend());
  root.append(airlock, board, controls);
  container.replaceChildren(root);
  update(state);
  const stopKeyboard = listenKeyboard(window, actions);
  return () => {
    stopKeyboard();
    window.clearTimeout(endTimer);
    container.replaceChildren();
  };
};
