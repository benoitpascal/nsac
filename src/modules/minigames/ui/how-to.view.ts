import type { MiniGame } from '../core/minigame';

/** Fills the box above the game with how to play it: its goal and its controls, step by step. */
export const showHowTo = (box: HTMLElement, game: MiniGame) => {
  const title = document.createElement('h2');
  title.className = 'minigames__howto-title';
  title.textContent = 'How to play';
  const steps = document.createElement('ol');
  steps.className = 'minigames__howto-steps';
  steps.append(
    ...game.howTo.map((text) => Object.assign(document.createElement('li'), { textContent: text })),
  );
  box.replaceChildren(title, steps);
};
