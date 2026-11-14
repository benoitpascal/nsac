/** The parts of the game screen that change while playing. */
export type LightsOutLayout = {
  root: HTMLElement;
  level: HTMLElement;
  moves: HTMLElement;
  restart: HTMLButtonElement;
  grid: HTMLElement;
  message: HTMLElement;
};

const element = <K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text = '') => {
  const created = document.createElement(tag);
  created.className = `mg-lights-out-${className}`;
  created.textContent = text;
  return created;
};

/** Builds the screen: level and moves on top, the panel of lights, then the restart button. */
export const createLayout = (): LightsOutLayout => {
  const root = element('div', 'game');
  const status = element('div', 'status');
  const level = element('span', 'chip');
  const moves = element('span', 'chip');
  const grid = element('div', 'grid');
  grid.setAttribute('role', 'grid');
  grid.setAttribute('aria-label', 'Control panel');
  const message = element('p', 'message', 'Power saved!');
  message.hidden = true;
  message.setAttribute('role', 'status');
  const restart = element('button', 'restart', '↻ Restart');
  restart.type = 'button';
  status.append(level, moves);
  root.append(status, grid, message, restart);
  return { root, level, moves, restart, grid, message };
};
