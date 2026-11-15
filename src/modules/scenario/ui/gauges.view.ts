import { el } from './dom';
import type { BaseStores } from '../core/base-stores';

const GAUGES = [
  { key: 'air', name: 'Air', icon: 'oxygen' },
  { key: 'power', name: 'Power', icon: 'bolt' },
  { key: 'water', name: 'Water', icon: 'drop' },
  { key: 'food', name: 'Food', icon: 'food' },
] as const;

/** Renders the base's vital gauges. */
export const renderGauges = (stores: BaseStores) => {
  const list = el('ul', 'resources');
  for (const gauge of GAUGES) {
    const value = stores[gauge.key];
    const item = el('li', 'resource');
    item.style.setProperty('--level', `${value}%`);
    item.innerHTML = `<svg class="hud-icon" aria-hidden="true"><use href="/arcadia/hud-icons.svg#${gauge.icon}" /></svg>`;
    const bar = el('span', 'resource__bar');
    Object.entries({
      role: 'meter',
      'aria-label': gauge.name,
      'aria-valuenow': String(value),
      'aria-valuemin': '0',
      'aria-valuemax': '100',
    }).forEach(([k, v]) => bar.setAttribute(k, v));
    item.append(
      el('span', 'resource__name', gauge.name),
      el('span', 'resource__value', `${value} %`),
      bar,
    );
    list.append(item);
  }
  return list;
};
