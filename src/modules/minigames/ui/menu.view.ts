import type { MiniGame } from '../core/minigame';

/** Fills the menu with one card per game; picking a card reports the game. */
export const showMenu = (
  menu: HTMLElement,
  games: readonly MiniGame[],
  onPick: (game: MiniGame) => void,
) => {
  const cards = games.map((game, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'minigames__card';
    const number = document.createElement('span');
    number.className = 'minigames__number';
    number.textContent = String(index + 1);
    const title = document.createElement('strong');
    title.textContent = game.title;
    const summary = document.createElement('span');
    summary.textContent = game.summary;
    card.append(number, title, summary);
    card.addEventListener('click', () => onPick(game));
    return card;
  });
  menu.replaceChildren(...cards);
};
