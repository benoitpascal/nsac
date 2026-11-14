import { HOOK_DISTANCES, SIDES } from '../core/types';
import type { Hook } from '../core/types';

/** The parts of the game screen that change while playing. */
export type BalanceElements = {
  root: HTMLElement;
  stage: HTMLElement;
  beam: HTMLElement;
  hooks: readonly { hook: Hook; element: HTMLElement }[];
  tray: HTMLElement;
  levels: readonly HTMLElement[];
  reset: HTMLButtonElement;
};

const PREFIX = 'mg-precision-balance';
/** Distance between two hooks, in percent of the arm length. */
const HOOK_SPACING_PERCENT = 11;
const CENTER_PERCENT = 50;

const create = <K extends keyof HTMLElementTagNameMap>(tag: K, part: string) => {
  const element = document.createElement(tag);
  element.className = `${PREFIX}-${part}`;
  return element;
};

const createHook = (hook: Hook) => {
  const element = create('div', 'hook');
  const direction = hook.side === 'left' ? -1 : 1;
  element.style.left = `${CENTER_PERCENT + direction * hook.distance * HOOK_SPACING_PERCENT}%`;
  element.dataset.hookSide = hook.side;
  element.dataset.hookDistance = String(hook.distance);
  return { hook, element };
};

/** Builds the arm with its hooks, the pivot, the tray and the top bar inside the container. */
export const buildLayout = (container: HTMLElement, levelCount: number): BalanceElements => {
  const root = create('div', 'root');
  const bar = create('div', 'bar');
  const levels = Array.from({ length: levelCount }, () => create('span', 'level'));
  const reset = create('button', 'reset');
  reset.type = 'button';
  reset.textContent = '↺';
  reset.setAttribute('aria-label', 'Reset level');
  bar.append(...levels, reset);
  const stage = create('div', 'stage');
  const beam = create('div', 'beam');
  const hooks = SIDES.flatMap((side) =>
    HOOK_DISTANCES.map((distance) => createHook({ side, distance })),
  );
  beam.append(...hooks.map(({ element }) => element));
  stage.append(beam, create('div', 'pivot'));
  const tray = create('div', 'tray');
  tray.dataset.tray = 'true';
  root.append(bar, stage, tray);
  container.replaceChildren(root);
  return { root, stage, beam, hooks, tray, levels, reset };
};
