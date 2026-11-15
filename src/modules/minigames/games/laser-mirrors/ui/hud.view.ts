/** The level and flip counters above the board. */
export type Hud = { element: HTMLElement; show: (level: number, flips: number) => void };

const badge = () => {
  const element = document.createElement('span');
  element.className = 'mg-laser-mirrors-badge';
  return element;
};

/** Creates the counters for the given level count; `show` takes a level number (from 1). */
export const createHud = (levelCount: number): Hud => {
  const element = document.createElement('div');
  element.className = 'mg-laser-mirrors-hud';
  const level = badge();
  const flips = badge();
  element.append(level, flips);
  const show = (levelNumber: number, flipCount: number) => {
    level.textContent = `Level ${levelNumber}/${levelCount}`;
    flips.textContent = `Flips ${flipCount}`;
  };
  return { element, show };
};
