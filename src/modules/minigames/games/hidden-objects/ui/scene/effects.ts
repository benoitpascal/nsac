import { createSvg } from './svg';
import type { PlacedItem } from '../../core/layout';
import type { Scene } from './scene.view';

/** Runs a callback later; all pending callbacks are dropped when the game stops. */
export type Later = (callback: () => void, delayMs: number) => void;

/** Lengths of the effects, matching the animations of hidden-objects.css (ms). */
const FOUND_MS = 600;
const WRONG_MS = 400;
const HINT_MS = 2000;
const SPARKLE_RAYS = 8;
const FULL_TURN_DEG = 360;
const RAY_INNER = 6;
const RAY_OUTER = 14;
const HINT_RING_SHARE = 0.8;

const sparkle = (item: PlacedItem) => {
  const holder = createSvg('g', { transform: `translate(${item.x} ${item.y})` });
  const rays = createSvg('g', { class: 'mg-hidden-objects-sparkle' });
  Array.from({ length: SPARKLE_RAYS }, (_, index) => {
    const turn = (index * FULL_TURN_DEG) / SPARKLE_RAYS;
    return createSvg('line', {
      x1: RAY_INNER,
      x2: RAY_OUTER,
      y1: 0,
      y2: 0,
      transform: `rotate(${turn})`,
    });
  }).forEach((ray) => rays.append(ray));
  holder.append(rays);
  return holder;
};

/** Collects a found object: it sparkles and fades away. */
export const showFound = (scene: Scene, item: PlacedItem, later: Later) => {
  const node = scene.itemNodes.get(item.id);
  node?.classList.add('is-found');
  const burst = sparkle(item);
  scene.svg.append(burst);
  later(() => {
    node?.parentElement?.remove();
    burst.remove();
  }, FOUND_MS);
};

/** Flashes an object that is not on the list. */
export const showWrong = (scene: Scene, item: PlacedItem, later: Later) => {
  const node = scene.itemNodes.get(item.id);
  node?.classList.add('is-wrong');
  later(() => node?.classList.remove('is-wrong'), WRONG_MS);
};

/** Circles an object for a moment to show where it is. */
export const showHint = (scene: Scene, item: PlacedItem, later: Later) => {
  const ring = createSvg('circle', {
    class: 'mg-hidden-objects-hint',
    cx: item.x,
    cy: item.y,
    r: item.size * HINT_RING_SHARE,
  });
  scene.svg.append(ring);
  later(() => ring.remove(), HINT_MS);
};
