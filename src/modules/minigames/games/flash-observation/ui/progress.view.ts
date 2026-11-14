import type { Game } from '../core/game';

const dotState = (game: Game, index: number) => {
  const pick = game.picks[index];
  if (pick !== undefined) return pick === game.rounds[index]?.question.answer ? 'right' : 'wrong';
  return index === game.picks.length ? 'now' : 'next';
};

/** Shows one dot per round: right, wrong, current or still to come. */
export const showProgress = (progress: HTMLElement, game: Game) => {
  const dots = game.rounds.map((_round, index) => {
    const dot = document.createElement('span');
    dot.className = `mg-flash-observation-dot mg-flash-observation-dot--${dotState(game, index)}`;
    return dot;
  });
  progress.replaceChildren(...dots);
};
