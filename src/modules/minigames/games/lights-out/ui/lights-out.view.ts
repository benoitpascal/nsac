import '../lights-out.css';
import {
  finalScore,
  isLastLevel,
  isLevelClear,
  nextLevel,
  pressCell,
  restartLevel,
  startGame,
} from '../core/game';
import { mountGrid } from './grid.view';
import { createLayout } from './layout';
import type { MiniGameResult, StopGame } from '../../../core/minigame';
import type { Random } from '../core/levels';

/** Time (ms) the dark panel stays on screen before the next level or the result. */
const LEVEL_CLEAR_DELAY_MS = 1200;

/**
 * Plays Lights Out inside the container: three panels to switch off, then finish is called
 * with the score. Returns how to stop the game.
 */
export const startLightsOut = (
  container: HTMLElement,
  finish: (result: MiniGameResult) => void,
  random: Random,
): StopGame => {
  const layout = createLayout();
  container.replaceChildren(layout.root);
  let state = startGame(random);
  let busy = false;
  let timer: number | undefined;
  const show = () => {
    grid.paint(state.board);
    layout.level.textContent = `Level ${state.levelIndex + 1}/${state.levels.length}`;
    layout.moves.textContent = `Moves ${state.moves}`;
  };
  const openLevel = () => {
    busy = false;
    layout.message.hidden = true;
    grid.build(state.board.size);
    show();
    grid.focus();
  };
  const endLevel = () => {
    busy = true;
    layout.message.hidden = false;
    timer = window.setTimeout(() => {
      if (isLastLevel(state)) return finish({ won: true, score: finalScore(state) });
      state = nextLevel(state);
      openLevel();
    }, LEVEL_CLEAR_DELAY_MS);
  };
  const press = (index: number) => {
    if (busy) return;
    state = pressCell(state, index);
    show();
    if (isLevelClear(state)) endLevel();
  };
  const grid = mountGrid(layout.grid, press);
  layout.restart.addEventListener('click', () => {
    if (busy) return;
    state = restartLevel(state);
    show();
  });
  openLevel();
  return () => {
    window.clearTimeout(timer);
    container.replaceChildren();
  };
};
