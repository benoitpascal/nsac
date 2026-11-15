import { LIVES, WINS_NEEDED } from '../core/docking';
import type { Docking } from '../core/docking';

/** The parts of the board redrawn at each frame, and the STOP button. */
export type StopInTimeView = {
  root: HTMLElement;
  stop: HTMLButtonElement;
  render: (docking: Docking) => void;
};

const PERCENT = 100;

const element = <K extends keyof HTMLElementTagNameMap>(tag: K, name: string, text = '') => {
  const node = document.createElement(tag);
  node.className = `mg-stop-in-time-${name}`;
  node.textContent = text;
  return node;
};

const row = (name: string, count: number, symbol: string) => {
  const holder = element('div', name);
  const items = Array.from({ length: count }, () => element('span', `${name}-item`, symbol));
  holder.append(...items);
  return { holder, items };
};

const percent = (value: number) => `${value * PERCENT}%`;

/** Builds the board: hearts and progress dots, the bar with its zone and cursor, the button. */
export const buildView = (): StopInTimeView => {
  const root = element('div', 'board');
  const hearts = row('lives', LIVES, '❤');
  const dots = row('dots', WINS_NEEDED, '●');
  const hud = element('div', 'hud');
  hud.append(hearts.holder, dots.holder);
  const track = element('div', 'track');
  const zone = element('div', 'zone');
  const shot = element('div', 'shot');
  const cursor = element('div', 'cursor', '🚀');
  track.append(zone, shot, cursor);
  const stop = element('button', 'stop', 'STOP');
  stop.type = 'button';
  root.append(hud, track, stop);
  const render = (docking: Docking) => {
    hearts.items.forEach((heart, index) =>
      heart.classList.toggle('is-lost', index < docking.misses),
    );
    dots.items.forEach((dot, index) => dot.classList.toggle('is-done', index < docking.successes));
    zone.style.left = percent(docking.zoneCenter - docking.zoneWidth / 2);
    zone.style.width = percent(docking.zoneWidth);
    cursor.style.left = percent(docking.cursor);
    const showing = docking.pause > 0 && docking.shot !== undefined;
    shot.hidden = !showing;
    track.classList.toggle('is-hit', showing && docking.shot?.hit === true);
    track.classList.toggle('is-miss', showing && docking.shot?.hit === false);
    if (docking.shot) shot.style.left = percent(docking.shot.position);
    shot.textContent = docking.shot?.hit ? '✔' : '✖';
    stop.disabled = docking.pause > 0;
  };
  return { root, stop, render };
};
