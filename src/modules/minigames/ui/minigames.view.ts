import { showHowTo } from './how-to.view';
import { showMenu } from './menu.view';
import { showResult } from './result.view';
import type { MiniGame, StopGame } from '../core/minigame';

export type MiniGamesElements = {
  menu: HTMLElement;
  screen: HTMLElement;
  title: HTMLElement;
  /** The box above the game telling how to play it. */
  howTo: HTMLElement;
  quit: HTMLButtonElement;
  board: HTMLElement;
  result: HTMLElement;
};

/**
 * Shows the menu of mini-games; picking one opens it full screen with its title, a quit button
 * and how to play it, and its end shows the score with a way to play again or go back to the menu.
 */
export const mountMiniGames = (elements: MiniGamesElements, games: readonly MiniGame[]) => {
  let stop: StopGame | undefined;
  const leave = () => {
    stop?.();
    stop = undefined;
    elements.board.replaceChildren();
    elements.result.hidden = true;
  };
  const backToMenu = () => {
    leave();
    elements.screen.hidden = true;
    elements.menu.hidden = false;
  };
  const play = (game: MiniGame) => {
    leave();
    elements.menu.hidden = true;
    elements.screen.hidden = false;
    elements.title.textContent = game.title;
    showHowTo(elements.howTo, game);
    stop = game.start(elements.board, (result) =>
      showResult(elements.result, result, { onRetry: () => play(game), onMenu: backToMenu }),
    );
  };
  elements.quit.addEventListener('click', backToMenu);
  showMenu(elements.menu, games, play);
  backToMenu();
};
