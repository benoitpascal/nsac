import { drawItem } from './shapes';
import type { Item } from '../core/items';

/** Shows a short "Look!" before the picture appears. */
export const showGetReady = (stage: HTMLElement) => {
  const ready = document.createElement('p');
  ready.className = 'mg-flash-observation-ready';
  ready.textContent = 'Look!';
  stage.replaceChildren(ready);
};

/** Shows the picture through the porthole, with a bar emptying over the given time (ms). */
export const showPicture = (stage: HTMLElement, items: readonly Item[], durationMs: number) => {
  const porthole = document.createElement('div');
  porthole.className = 'mg-flash-observation-porthole';
  porthole.append(...items.map((item) => drawItem(item.kind, item.colour)));
  const bar = document.createElement('div');
  bar.className = 'mg-flash-observation-timer';
  bar.style.animationDuration = `${durationMs}ms`;
  stage.replaceChildren(porthole, bar);
};
