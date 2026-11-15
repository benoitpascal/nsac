import { wetCells } from '../core/flow';
import { SIDES } from '../core/tiles';
import { focusTile, listenArrowKeys } from './keyboard';
import { createPipeSvg } from './pipe-svg';
import type { Level } from '../core/level';

const QUARTER_DEGREES = 90;
/** Grid column of the first tiles: the ice drill sits in the column before. */
const TILES_FIRST_COLUMN = 2;

/** Redraws the board after a turn: rotations and which pipes hold water. */
export type BoardUpdate = (level: Level, solved: boolean) => void;

const placed = <T extends HTMLElement>(element: T, row: number, column: number) => {
  element.style.gridRow = String(row + 1);
  element.style.gridColumn = String(column);
  return element;
};

const endPoint = (className: string, symbol: string, label: string) => {
  const point = document.createElement('div');
  point.className = `mg-pipe-flow-end ${className}`;
  point.textContent = symbol;
  point.setAttribute('aria-label', label);
  point.setAttribute('role', 'img');
  return point;
};

const showTurns = (tile: HTMLElement, turns: number) =>
  tile.style.setProperty('--mg-pipe-flow-turn', `${turns * QUARTER_DEGREES}deg`);

const createTile = (level: Level, index: number) => {
  const tile = document.createElement('button');
  tile.type = 'button';
  tile.className = 'mg-pipe-flow-tile';
  tile.tabIndex = index === 0 ? 0 : -1;
  tile.setAttribute('aria-label', `Pipe ${index + 1}`);
  tile.append(createPipeSvg(level.tiles[index].kind));
  showTurns(tile, level.tiles[index].turns);
  const row = Math.floor(index / level.size);
  return placed(tile, row, (index % level.size) + TILES_FIRST_COLUMN);
};

/**
 * Shows in the stage a new grid with the level's tiles, the ice drill and the tank; returns how
 * to redraw it.
 */
export const renderBoard = (
  stage: HTMLElement,
  level: Level,
  onTurn: (index: number) => void,
): BoardUpdate => {
  const buttons = level.tiles.map((_, index) => createTile(level, index));
  buttons.forEach((button, index) =>
    button.addEventListener('click', () => {
      focusTile(buttons, index);
      onTurn(index);
    }),
  );
  const drill = placed(endPoint('mg-pipe-flow-drill', '🧊', 'Ice drill'), level.source.row, 1);
  const tank = endPoint('mg-pipe-flow-tank', '🌱', 'Greenhouse tank');
  placed(tank, level.tank.row, level.size + TILES_FIRST_COLUMN);
  const grid = document.createElement('div');
  grid.className = 'mg-pipe-flow-grid';
  grid.style.setProperty('--mg-pipe-flow-size', String(level.size));
  grid.append(drill, ...buttons, tank);
  stage.replaceChildren(grid);
  listenArrowKeys(grid, buttons, level.size);
  const shownTurns = level.tiles.map((tile) => tile.turns);
  return (current, solved) => {
    const wet = wetCells(current);
    buttons.forEach((button, index) => {
      shownTurns[index] += (current.tiles[index].turns - shownTurns[index] + SIDES * SIDES) % SIDES;
      showTurns(button, shownTurns[index]);
      button.classList.toggle('mg-pipe-flow-tile--wet', wet.has(index));
    });
    tank.classList.toggle('mg-pipe-flow-tank--full', solved);
  };
};
