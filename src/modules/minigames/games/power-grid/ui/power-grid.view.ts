import { emptyBoard, isSolved } from '../core/board';
import { dragTo, pressCell } from '../core/cables';
import { LEVELS } from '../core/levels';
import { puzzleOf } from '../core/puzzle';
import { scoreFor } from '../core/score';
import { listenDrawing } from './drawing';
import { createGrid } from './grid.view';
import { createHud } from './hud.view';
import type { MiniGameResult, StopGame } from '../../../core/minigame';
import type { Board } from '../core/board';
import type { Cell } from '../core/cell';
import type { GridView } from './grid.view';
import '../power-grid.css';

/** Pause (ms) showing the lit grid before the next level or the result. */
const LEVEL_DONE_DELAY_MS = 900;

/** Plays the three levels in a row; solving the last one wins, with fewer points per reset. */
export const startPowerGrid = (
  container: HTMLElement,
  finish: (result: MiniGameResult) => void,
): StopGame => {
  const root = Object.assign(document.createElement('div'), { className: 'mg-power-grid' });
  let levelIndex = 0;
  let resets = 0;
  let colour = -1;
  let locked = false;
  let timer: number | undefined;
  let board: Board;
  let grid: GridView;
  const update = (next: Board) => {
    board = next;
    grid.show(board);
    if (!isSolved(board)) return;
    locked = true;
    grid.element.classList.add('mg-power-grid-grid--lit');
    timer = window.setTimeout(nextLevel, LEVEL_DONE_DELAY_MS);
  };
  const press = (cell: Cell) => {
    if (locked) return false;
    const drawing = pressCell(board, cell);
    colour = drawing.colour;
    update(drawing.board);
    return colour >= 0;
  };
  const drag = (cell: Cell) => {
    if (!locked) update(dragTo(board, colour, cell));
  };
  const hud = createHud(() => {
    if (locked) return;
    resets += 1;
    update(emptyBoard(board.puzzle));
  });
  const loadLevel = () => {
    locked = false;
    board = emptyBoard(puzzleOf(LEVELS[levelIndex]));
    grid = createGrid(board.puzzle);
    listenDrawing(grid.element, board.puzzle.size, { press, drag });
    grid.show(board);
    hud.showLevel(levelIndex + 1, LEVELS.length);
    root.replaceChildren(hud.element, grid.element);
  };
  const nextLevel = () => {
    levelIndex += 1;
    if (levelIndex < LEVELS.length) loadLevel();
    else finish({ won: true, score: scoreFor(resets) });
  };
  loadLevel();
  container.replaceChildren(root);
  return () => {
    window.clearTimeout(timer);
    container.replaceChildren();
  };
};
