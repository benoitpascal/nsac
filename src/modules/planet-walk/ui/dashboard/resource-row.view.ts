import type { ResourceRow } from './dashboard-rows';

const ICONS = '/arcadia/hud-icons.svg';
const SVG = 'http://www.w3.org/2000/svg';

const iconOf = (name: string) => {
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('class', 'station-resource__icon');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS(SVG, 'use');
  use.setAttribute('href', `${ICONS}#${name}`);
  svg.append(use);
  return svg;
};

const span = (className: string, text = '') => {
  const created = document.createElement('span');
  created.className = className;
  created.textContent = text;
  return created;
};

/** A resource line, drawn like the briefing's: icon, name, value and a bar. */
export const rowElement = ({ icon, name, value, level }: ResourceRow) => {
  const item = document.createElement('li');
  item.className = 'station-resource';
  item.style.setProperty('--level', `${level}%`);
  item.append(
    iconOf(icon),
    span('station-resource__name', name),
    span('station-resource__value', value),
    span('station-resource__bar'),
  );
  return item;
};
