import { LEVEL_SIZES, LEVEL_TIME_MS } from '../core/maze-game';
import type { MazeState } from '../core/maze-game';

const MS_PER_SECOND = 1000;
/** Below this many seconds the timer turns orange. */
const LOW_TIME_SECONDS = 10;
const PERCENT = 100;

const createElement = (className: string, text = '') => {
  const element = document.createElement('span');
  element.className = className;
  element.textContent = text;
  return element;
};

/** Builds the top bar: one dot per level and a timer bar, and returns how to refresh it. */
export const createHud = () => {
  const element = document.createElement('div');
  element.className = 'mg-maze-hud';
  const dots = LEVEL_SIZES.map(() => createElement('mg-maze-dot', '🛰️'));
  const levels = createElement('mg-maze-levels');
  levels.append(...dots);
  const bar = createElement('mg-maze-timer-bar');
  const fill = createElement('mg-maze-timer-fill');
  bar.append(fill);
  const seconds = createElement('mg-maze-seconds');
  const timer = createElement('mg-maze-timer', '⏱️');
  timer.append(bar, seconds);
  element.append(levels, timer);
  const update = (state: MazeState) => {
    dots.forEach((dot, level) => {
      dot.classList.toggle('mg-maze-dot--done', level < state.level);
      dot.classList.toggle('mg-maze-dot--current', level === state.level);
    });
    const left = Math.ceil(state.remainingMs / MS_PER_SECOND);
    seconds.textContent = String(left);
    fill.style.width = `${(state.remainingMs / LEVEL_TIME_MS) * PERCENT}%`;
    timer.classList.toggle('mg-maze-timer--low', left <= LOW_TIME_SECONDS);
  };
  return { element, update };
};
