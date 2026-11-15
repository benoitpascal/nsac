/** The bar above the grid: level reached and the reset button. */
export type Hud = { element: HTMLElement; showLevel: (level: number, count: number) => void };

/** Builds the bar; the reset button calls onReset. */
export const createHud = (onReset: () => void): Hud => {
  const element = document.createElement('div');
  element.className = 'mg-power-grid-hud';
  const label = document.createElement('span');
  label.className = 'mg-power-grid-level';
  const reset = document.createElement('button');
  reset.type = 'button';
  reset.className = 'mg-power-grid-reset';
  reset.textContent = '↺ Reset';
  reset.addEventListener('click', onReset);
  element.append(label, reset);
  const showLevel = (level: number, count: number) => {
    label.textContent = `⚡ Level ${level} / ${count}`;
  };
  return { element, showLevel };
};
