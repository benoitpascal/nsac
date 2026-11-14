import '../maze.css';
import { createHud } from './hud';
import { listenToMoveKeys } from './keyboard';
import { drawMaze } from './maze-canvas';
import { createPad } from './pad';
import { readPalette } from './palette';
import { moveAstronaut, passTime, startMazeGame } from '../core/maze-game';
import { mazeResult } from '../core/score';
import type { Direction } from '../core/cell';
import type { MiniGameResult, StopGame } from '../../../core/minigame';

/** Longest time counted between two frames, so a hidden tab does not eat the timer at once. */
const MAX_FRAME_MS = 250;

const createBoard = () => {
  const canvas = document.createElement('canvas');
  canvas.className = 'mg-maze-canvas';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Space station maze');
  const board = document.createElement('div');
  board.className = 'mg-maze-board';
  board.append(canvas);
  return { board, canvas };
};

/**
 * Plays the maze inside the container: three levels against the clock, moved with the arrow
 * keys, WASD/ZQSD or the on-screen arrows. Calls finish once, and returns how to stop.
 */
export const startMaze = (
  container: HTMLElement,
  finish: (result: MiniGameResult) => void,
): StopGame => {
  let state = startMazeGame(Math.random);
  let frame = 0;
  let last = performance.now();
  let over = false;
  const hud = createHud();
  const { board, canvas } = createBoard();
  const root = document.createElement('div');
  root.className = 'mg-maze';
  const halt = () => {
    over = true;
    cancelAnimationFrame(frame);
    stopKeys();
  };
  const render = () => {
    drawMaze(canvas, state, palette);
    hud.update(state);
    if (state.status === 'playing' || over) return;
    halt();
    finish(mazeResult(state));
  };
  const move = (direction: Direction) => {
    state = moveAstronaut(state, direction, Math.random);
    render();
  };
  const loop = (now: number) => {
    state = passTime(state, Math.min(now - last, MAX_FRAME_MS));
    last = now;
    render();
    if (!over) frame = requestAnimationFrame(loop);
  };
  root.append(hud.element, board, createPad(move));
  container.replaceChildren(root);
  const palette = readPalette(root);
  const stopKeys = listenToMoveKeys(window, move);
  frame = requestAnimationFrame(loop);
  return () => {
    halt();
    container.replaceChildren();
  };
};
