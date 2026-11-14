import '../liquid-sort.css';
import { isLastLevel, isLevelSolved, restartLevel, tapTube, undoMove } from '../core/game';
import { finalScore, nextLevel, startRun } from '../core/run';
import { buildLayout, renderLayout } from './layout.view';
import type { MiniGameResult, StopGame } from '../../../core/minigame';
import type { SortLevel } from '../core/game';
import type { RandomSource } from '../core/level';
import type { SortRun } from '../core/run';

/** Pause (ms) showing the solved level before moving on. */
const CHEER_DELAY_MS = 1200;

/**
 * Plays Liquid Sort in the container: tubes are tapped, clicked or picked with number keys,
 * U undoes and R restarts the level. Calls finish once the last level is solved.
 */
export const startLiquidSort = (
  container: HTMLElement,
  finish: (result: MiniGameResult) => void,
  random: RandomSource = Math.random,
): StopGame => {
  const layout = buildLayout(container);
  let run: SortRun = startRun(random);
  let timer: number | undefined;
  const solved = () => isLevelSolved(run.level);
  const render = () => renderLayout(layout, run, solved());
  const advance = () => {
    timer = undefined;
    if (isLastLevel(run.level)) {
      finish({ won: true, score: finalScore(run) });
      return;
    }
    run = nextLevel(run, random);
    render();
  };
  const play = (change: (level: SortLevel) => SortLevel) => {
    if (timer !== undefined) return;
    run = { ...run, level: change(run.level) };
    render();
    if (solved()) timer = window.setTimeout(advance, CHEER_DELAY_MS);
  };
  layout.shelf.addEventListener('click', (event) => {
    const tube = (event.target as HTMLElement).closest<HTMLElement>('[data-tube]');
    if (tube) play((level) => tapTube(level, Number(tube.dataset.tube)));
  });
  layout.undo.addEventListener('click', () => play(undoMove));
  layout.restart.addEventListener('click', () => play(restartLevel));
  const onKey = (event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const key = event.key.toLowerCase();
    if (key === 'u') play(undoMove);
    else if (key === 'r') play(restartLevel);
    else if (/^[1-9]$/.test(key)) play((level) => tapTube(level, Number(key) - 1));
  };
  document.addEventListener('keydown', onKey);
  render();
  return () => {
    window.clearTimeout(timer);
    document.removeEventListener('keydown', onKey);
  };
};
