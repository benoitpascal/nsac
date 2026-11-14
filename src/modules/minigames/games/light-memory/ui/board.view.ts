import '../light-memory.css';
import { LIGHT_COUNT } from '../core/memory';

/** Look of each light, in order top, right, bottom, left: a colour and its own symbol. */
const LIGHT_LOOKS = [
  { colour: 'red', symbol: '★' },
  { colour: 'yellow', symbol: '▲' },
  { colour: 'green', symbol: '●' },
  { colour: 'blue', symbol: '■' },
] as const;

/** The elements of the panel the game updates. */
export type Board = { lights: HTMLButtonElement[]; status: HTMLElement; round: HTMLElement };

const createLight = (index: number) => {
  const look = LIGHT_LOOKS[index % LIGHT_LOOKS.length] ?? LIGHT_LOOKS[0];
  const light = document.createElement('button');
  light.type = 'button';
  light.className = `mg-light-memory-light mg-light-memory-light--${look.colour}`;
  light.setAttribute('aria-label', `${look.colour} ${String(index + 1)}`);
  const symbol = document.createElement('span');
  symbol.className = 'mg-light-memory-symbol';
  symbol.textContent = look.symbol;
  const key = document.createElement('span');
  key.className = 'mg-light-memory-key';
  key.textContent = String(index + 1);
  light.append(symbol, key);
  return light;
};

/** Draws the status line and the four signal lights around the round counter. */
export const renderBoard = (container: HTMLElement): Board => {
  const status = document.createElement('p');
  status.className = 'mg-light-memory-status';
  status.setAttribute('aria-live', 'polite');
  const round = document.createElement('span');
  round.className = 'mg-light-memory-round';
  const lights = Array.from({ length: LIGHT_COUNT }, (_, index) => createLight(index));
  const panel = document.createElement('div');
  panel.className = 'mg-light-memory-panel';
  panel.append(...lights, round);
  const wrapper = document.createElement('div');
  wrapper.className = 'mg-light-memory';
  wrapper.append(status, panel);
  container.replaceChildren(wrapper);
  return { lights, status, round };
};
