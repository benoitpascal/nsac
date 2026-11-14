import '../stop-in-time.css';
import { moveCursor, startDocking } from '../core/docking';
import { outcomeOf, scoreOf, stopCursor } from '../core/stop';
import { buildView } from './view';
import type { MiniGameResult, StopGame } from '../../../core/minigame';

const MS_PER_SECOND = 1000;
/** Longest time step (s) taken at once, so a hidden tab does not jump the cursor. */
const MAX_STEP = 0.1;
const STOP_KEYS = new Set([' ', 'Enter']);

/**
 * Runs Stop in Time inside the container until 5 dockings or 3 misses, then calls finish once.
 * Returns how to stop it: cancels the animation frame and the keyboard listener.
 */
export const startStopInTime = (
  container: HTMLElement,
  finish: (result: MiniGameResult) => void,
): StopGame => {
  const view = buildView();
  container.replaceChildren(view.root);
  let docking = startDocking(Math.random);
  let frame = 0;
  let last: number | undefined;
  const press = () => {
    docking = stopCursor(docking, Math.random);
    view.render(docking);
  };
  const onKey = (event: KeyboardEvent) => {
    if (!STOP_KEYS.has(event.key) || event.repeat) return;
    event.preventDefault();
    press();
  };
  const stop = () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('keydown', onKey);
  };
  const tick = (now: number) => {
    const seconds = last === undefined ? 0 : Math.min((now - last) / MS_PER_SECOND, MAX_STEP);
    last = now;
    docking = moveCursor(docking, seconds);
    view.render(docking);
    const outcome = outcomeOf(docking);
    if (outcome !== 'playing' && docking.pause <= 0) {
      stop();
      finish({ won: outcome === 'won', score: scoreOf(docking) });
      return;
    }
    frame = requestAnimationFrame(tick);
  };
  view.stop.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    press();
  });
  window.addEventListener('keydown', onKey);
  frame = requestAnimationFrame(tick);
  return stop;
};
