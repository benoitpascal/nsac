import type { MiniGameResult } from '../core/minigame';

export type ResultActions = { onRetry: () => void; onMenu: () => void };

const button = (label: string, onClick: () => void) => {
  const element = document.createElement('button');
  element.type = 'button';
  element.className = 'minigames__action';
  element.textContent = label;
  element.addEventListener('click', onClick);
  return element;
};

/** Shows how the game ended, with buttons to play again or go back to the menu. */
export const showResult = (panel: HTMLElement, result: MiniGameResult, actions: ResultActions) => {
  const heading = document.createElement('h2');
  heading.textContent = result.won ? 'Well done!' : 'Try again!';
  const score = document.createElement('p');
  score.textContent = `Score: ${Math.round(result.score)} / 100`;
  const buttons = document.createElement('div');
  buttons.className = 'minigames__actions';
  buttons.append(button('Play again', actions.onRetry), button('All games', actions.onMenu));
  panel.replaceChildren(heading, score, buttons);
  panel.hidden = false;
};
