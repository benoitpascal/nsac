import '../precision-balance.css';
import { LEVEL_COUNT } from '../core/level-generator';
import { askHint } from '../core/help';
import { computeScore } from '../core/score';
import { minimumMoves, nextLevel, playMove, resetLevel, startSession } from '../core/session';
import { isLevelSolved } from '../core/torque';
import { buildLayout } from './layout';
import { bindControls } from './controls';
import { renderSession } from './render';
import type { MiniGameResult, StopGame } from '../../../core/minigame';
import type { Hint } from '../core/hint';
import type { Session } from '../core/session';
import type { Hook } from '../core/types';

/** Time (ms) the level glow stays before the next level shows up. */
const LEVEL_PAUSE_MS = 1200;
const MS_PER_SECOND = 1000;

/** Plays the balance game in the container until the last level is solved. */
export const startPrecisionBalance = (
  container: HTMLElement,
  finish: (result: MiniGameResult) => void,
): StopGame => {
  const elements = buildLayout(container, LEVEL_COUNT);
  const startedAt = performance.now();
  let session = startSession(Math.random);
  let selected: number | null = null;
  let hint: Hint | null = null;
  let pause: number | undefined;
  const render = () => renderSession(elements, session, selected, hint);
  /** Shows a new state of the game, with the hint to show (none by default). */
  const show = (next: Session, shown: Hint | null = null) => {
    session = next;
    hint = shown;
    selected = null;
    render();
  };
  const advance = () => {
    pause = undefined;
    const next = nextLevel(session);
    if (next !== null) return show(next);
    const seconds = (performance.now() - startedAt) / MS_PER_SECOND;
    const score = computeScore(session.moves, minimumMoves(session), seconds, session.hints);
    finish({ won: true, score });
  };
  const place = (id: number, hook: Hook | null) => {
    if (pause !== undefined) return;
    const moved = playMove(session, id, hook);
    show(moved, moved === session ? hint : null);
    if (isLevelSolved(session.weights)) pause = window.setTimeout(advance, LEVEL_PAUSE_MS);
  };
  bindControls(elements.root, {
    paused: () => pause !== undefined,
    weights: () => session.weights,
    selected: () => selected,
    select: (id) => {
      selected = id;
      render();
    },
    place,
  });
  elements.reset.addEventListener('click', () => {
    if (pause === undefined) show(resetLevel(session));
  });
  elements.help.addEventListener('click', () => {
    const asked = pause === undefined && hint === null ? askHint(session) : null;
    if (asked !== null) show(asked.session, asked.hint);
  });
  render();
  return () => window.clearTimeout(pause);
};
