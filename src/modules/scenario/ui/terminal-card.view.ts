import { button, el } from './dom';

/** A sprite icon of public/arcadia/hud-icons.svg. */
export const hudIcon = (name: string) =>
  `<svg class="hud-icon" aria-hidden="true"><use href="/arcadia/hud-icons.svg#${name}" /></svg>`;

/** A card that is a button as a whole, as in the day's plan, with its icon and a chevron. */
export const terminalCard = (
  iconName: string,
  title: string,
  text: string,
  onClick: () => void,
) => {
  const choice = button('', 'hud-panel plan-action plan-action--choice terminal-card', onClick);
  const words = el('span', 'terminal-card__words');
  words.append(el('span', 'plan-action__title', title), el('span', 'plan-action__text', text));
  choice.innerHTML = hudIcon(iconName);
  choice.append(words);
  choice.insertAdjacentHTML('beforeend', hudIcon('chevrons'));
  const item = el('li', '');
  item.append(choice);
  return item;
};

/** Lays cards out like the day's plan (planning.css). */
export const cardList = (label: string, ...cards: HTMLLIElement[]) => {
  const list = el('ul', 'planning__actions');
  list.setAttribute('aria-label', label);
  list.append(...cards);
  return list;
};
