import { createSvg } from './scene/svg';
import { ICON_BOX, ITEM_ICONS } from './icons/item-icons';
import type { ItemKind } from '../core/item-kinds';

/** The list of objects to find, with a way to tick one off. */
export type TargetList = { element: HTMLElement; markFound: (kind: ItemKind) => void };

const half = ICON_BOX / 2;

const createEntry = (kind: ItemKind) => {
  const entry = document.createElement('li');
  entry.className = 'mg-hidden-objects-target';
  const icon = createSvg('svg', { viewBox: `${-half} ${-half} ${ICON_BOX} ${ICON_BOX}` });
  icon.innerHTML = ITEM_ICONS[kind].markup;
  const word = document.createElement('span');
  word.textContent = ITEM_ICONS[kind].word;
  entry.append(icon, word);
  return entry;
};

/** Shows each object to find as an icon with its word underneath. */
export const createTargetList = (targets: readonly ItemKind[]): TargetList => {
  const element = document.createElement('ul');
  element.className = 'mg-hidden-objects-targets';
  const entries = new Map(targets.map((kind) => [kind, createEntry(kind)]));
  element.append(...entries.values());
  return { element, markFound: (kind) => entries.get(kind)?.classList.add('is-found') };
};
