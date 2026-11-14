import '../precision-balance.css';
import { LEVEL_COUNT } from '../core/level-generator';
import { computeScore } from '../core/score';
import { minimumMoves, nextLevel, playMove, resetLevel, startSession } from '../core/session';
import { isLevelSolved } from '../core/torque';
import { buildLayout } from './layout';
import { bindPointer } from './pointer';
import { renderSession } from './render';
import type { MiniGameResult, StopGame } from '../../../core/minigame';
import type { Hook } from '../core/types';
import type { DropTarget } from './drop-target';

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
  let pause: number | undefined;
  const render = () => renderSession(elements, session, selected);
  const advance = () => {
    pause = undefined;
    const next = nextLevel(session);
    if (next !== null) {
      session = next;
      render();
      return;
    }
    const seconds = (performance.now() - startedAt) / MS_PER_SECOND;
    finish({ won: true, score: computeScore(session.moves, minimumMoves(session), seconds) });
  };
  const place = (id: number, hook: Hook | null) => {
    if (pause !== undefined) return;
    session = playMove(session, id, hook);
    selected = null;
    render();
    if (isLevelSolved(session.weights)) pause = window.setTimeout(advance, LEVEL_PAUSE_MS);
  };
  const weightOf = (id: number) => session.weights.find((weight) => weight.id === id);
  const dropOn = (id: number, target: DropTarget) => {
    if (target.kind === 'hook') place(id, target.hook);
    else if (target.kind === 'tray') place(id, null);
  };
  bindPointer(elements.root, {
    canGrab: (id) => pause === undefined && weightOf(id)?.locked === false,
    onDrop: dropOn,
    onTapTarget: (target) => {
      if (selected !== null) dropOn(selected, target);
    },
    onTapWeight: (id) => {
      const hook = weightOf(id)?.hook ?? null;
      if (selected !== null && selected !== id && hook !== null) return place(selected, hook);
      if (weightOf(id)?.locked !== false) return;
      selected = selected === id ? null : id;
      render();
    },
  });
  elements.reset.addEventListener('click', () => {
    if (pause !== undefined) return;
    session = resetLevel(session);
    selected = null;
    render();
  });
  render();
  return () => window.clearTimeout(pause);
};
