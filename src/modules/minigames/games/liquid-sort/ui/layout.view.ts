import { LEVEL_COLORS, movesOf } from '../core/game';
import { renderRack } from './rack.view';
import type { SortRun } from '../core/run';

/** The parts of the game screen that change while playing. */
export type SortLayout = {
  levels: HTMLElement;
  moves: HTMLElement;
  shelf: HTMLElement;
  undo: HTMLButtonElement;
  restart: HTMLButtonElement;
  cheer: HTMLElement;
};

const element = <K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text = '') => {
  const node = document.createElement(tag);
  node.className = `mg-liquid-sort-${className}`;
  node.textContent = text;
  return node;
};

const controlButton = (symbol: string, label: string) => {
  const button = element('button', 'control', symbol);
  button.type = 'button';
  button.setAttribute('aria-label', label);
  button.title = label;
  return button;
};

/** Builds the game screen inside the container: level stars, move count, tubes and buttons. */
export const buildLayout = (container: HTMLElement): SortLayout => {
  const layout: SortLayout = {
    levels: element('div', 'levels'),
    moves: element('span', 'moves'),
    shelf: element('div', 'shelf'),
    undo: controlButton('↶', 'Undo (U)'),
    restart: controlButton('⟲', 'Restart level (R)'),
    cheer: element('div', 'cheer', '★'),
  };
  const bar = element('div', 'bar');
  bar.append(layout.levels, layout.moves);
  const controls = element('div', 'controls');
  controls.append(layout.undo, layout.restart);
  const root = element('div', 'game');
  root.append(bar, layout.shelf, controls, layout.cheer);
  container.replaceChildren(root);
  return layout;
};

/** Refreshes the screen from the game, keeping keyboard focus on the same tube. */
export const renderLayout = (layout: SortLayout, run: SortRun, solved: boolean) => {
  const focused = layout.shelf.contains(document.activeElement)
    ? (document.activeElement as HTMLElement).dataset.tube
    : undefined;
  const stars = LEVEL_COLORS.map((_, index) => (index <= run.level.index ? '★' : '☆'));
  layout.levels.textContent = stars.join(' ');
  layout.levels.setAttribute(
    'aria-label',
    `Level ${run.level.index + 1} of ${LEVEL_COLORS.length}`,
  );
  layout.moves.textContent = `Moves ${movesOf(run.level)}`;
  renderRack(layout.shelf, run.level.rack, run.level.selected);
  layout.undo.disabled = solved || movesOf(run.level) === 0;
  layout.restart.disabled = solved || movesOf(run.level) === 0;
  layout.cheer.hidden = !solved;
  if (focused !== undefined)
    layout.shelf.querySelector<HTMLElement>(`[data-tube="${focused}"]`)?.focus();
};
