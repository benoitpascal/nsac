import { DIRECTIONS } from '../core/directions';
import { START_SHIELDS } from '../core/rules';
import type { Direction } from '../core/directions';

/** The parts of the game screen that change while playing. */
export type Board = {
  stage: HTMLElement;
  sign: HTMLElement;
  arrow: HTMLElement;
  timerFill: HTMLElement;
  shields: HTMLElement[];
  progress: HTMLElement;
};

const PREFIX = 'mg-direction-flash';
const ARROW = '➜';
const SWAP = '⇄';
const SHIELD = '🛡';

const element = (tag: string, part: string, text = '') => {
  const node = document.createElement(tag);
  node.className = `${PREFIX}-${part}`;
  node.textContent = text;
  return node;
};

const buildPad = (onDirection: (direction: Direction) => void) => {
  const pad = element('div', 'pad');
  DIRECTIONS.forEach((direction) => {
    const button = element('button', 'button', ARROW);
    button.setAttribute('type', 'button');
    button.setAttribute('aria-label', direction);
    button.dataset.direction = direction;
    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      onDirection(direction);
    });
    pad.append(button);
  });
  return pad;
};

/** Fills the container with the flight screen; the arrow buttons call onDirection. */
export const buildBoard = (
  container: HTMLElement,
  onDirection: (direction: Direction) => void,
): Board => {
  const shields = Array.from({ length: START_SHIELDS }, () => element('span', 'shield', SHIELD));
  const shieldRow = element('div', 'shields');
  shieldRow.append(...shields);
  const progress = element('span', 'progress');
  const hud = element('div', 'hud');
  hud.append(shieldRow, progress);
  const arrow = element('span', 'arrow', ARROW);
  const sign = element('div', 'sign');
  sign.append(arrow, element('span', 'swap', SWAP));
  const timerFill = element('div', 'timer-fill');
  const timer = element('div', 'timer');
  timer.append(timerFill);
  const stage = element('div', 'stage');
  stage.append(sign, timer);
  const root = element('div', 'root');
  root.append(hud, stage, buildPad(onDirection));
  container.replaceChildren(root);
  return { stage, sign, arrow, timerFill, shields, progress };
};
