import { createSvg } from './svg';
import { WORKSHOP_BACKDROP } from './workshop-backdrop';
import { SCENE_HEIGHT, SCENE_WIDTH } from '../../core/layout';
import { ICON_BOX, ITEM_ICONS } from '../icons/item-icons';
import type { Layout, PlacedItem } from '../../core/layout';

/** The drawn workshop and the drawing of each object, by object id. */
export type Scene = { svg: SVGSVGElement; itemNodes: ReadonlyMap<number, SVGGElement> };

const drawItem = (item: PlacedItem) => {
  const scale = item.size / ICON_BOX;
  const holder = createSvg('g', {
    transform: `translate(${item.x} ${item.y}) rotate(${item.rotation}) scale(${scale})`,
  });
  const body = createSvg('g', { class: 'mg-hidden-objects-item', 'data-item': item.id });
  body.innerHTML = `<circle r="${ICON_BOX / 2}" class="mg-hidden-objects-hit"/>${ITEM_ICONS[item.kind].markup}`;
  holder.append(body);
  return { holder, body };
};

/**
 * Draws the workshop with its objects, scaled to the width of its box, and calls onPick with
 * the object under a click or tap.
 */
export const createScene = (layout: Layout, onPick: (item: PlacedItem) => void): Scene => {
  const svg = createSvg('svg', {
    class: 'mg-hidden-objects-scene',
    viewBox: `0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}`,
  });
  const backdrop = createSvg('g', { class: 'mg-hidden-objects-backdrop' });
  backdrop.innerHTML = WORKSHOP_BACKDROP;
  svg.append(backdrop);
  const itemNodes = new Map<number, SVGGElement>();
  layout.items.forEach((item) => {
    const { holder, body } = drawItem(item);
    svg.append(holder);
    itemNodes.set(item.id, body);
  });
  svg.addEventListener('click', (event) => {
    const node = event.target instanceof Element ? event.target.closest('[data-item]') : null;
    const item = layout.items.find(
      (candidate) => String(candidate.id) === node?.getAttribute('data-item'),
    );
    if (item) onPick(item);
  });
  return { svg, itemNodes };
};
