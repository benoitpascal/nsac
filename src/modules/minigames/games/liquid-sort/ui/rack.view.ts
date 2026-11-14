import { TUBE_CAPACITY } from '../core/tubes';
import { fuelLook } from './palette';
import type { Rack, Tube } from '../core/tubes';

const renderLayer = (color: number) => {
  const look = fuelLook(color);
  const layer = document.createElement('span');
  layer.className = 'mg-liquid-sort-layer';
  layer.style.background = look.fill;
  layer.textContent = look.symbol;
  return layer;
};

const describeTube = (tube: Tube, position: number) => {
  const colors = tube.map((color) => fuelLook(color).name).join(', ');
  return `Tube ${position}: ${colors || 'empty'}`;
};

const renderTube = (tube: Tube, index: number, selected: boolean) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'mg-liquid-sort-tube';
  button.classList.toggle('mg-liquid-sort-tube--selected', selected);
  button.dataset.tube = String(index);
  button.setAttribute('aria-pressed', String(selected));
  button.setAttribute('aria-label', describeTube(tube, index + 1));
  const glass = document.createElement('span');
  glass.className = 'mg-liquid-sort-glass';
  glass.style.setProperty('--mg-liquid-sort-capacity', String(TUBE_CAPACITY));
  glass.append(...tube.map(renderLayer));
  const key = document.createElement('span');
  key.className = 'mg-liquid-sort-key';
  key.textContent = String(index + 1);
  button.append(glass, key);
  return button;
};

/** Draws every tube as a button, the picked one raised. */
export const renderRack = (shelf: HTMLElement, rack: Rack, selected: number | undefined) => {
  shelf.replaceChildren(...rack.map((tube, index) => renderTube(tube, index, index === selected)));
};
