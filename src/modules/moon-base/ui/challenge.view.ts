import { qualityOf } from '../core/campaign';
import { element } from './element';
import { CHALLENGE_TEXTS, QUALITY_TEXTS } from './texts';
import type { Campaign } from '../core/campaign';
import type { MiniGame } from '@/modules/minigames/core/minigame';

/** Which demo challenge is played. */
export type ChallengeId = 'calibration' | 'shelter';

export type ChallengeElements = {
  title: HTMLElement;
  story: HTMLElement;
  board: HTMLElement;
  result: HTMLElement;
};

/** What happens when the mini-game ends: the campaign after it, and where to save it. */
export type ChallengeSetup = {
  id: ChallengeId;
  game: MiniGame;
  campaign: Campaign;
  finish: (campaign: Campaign, score: number) => Campaign;
  save: (campaign: Campaign) => void;
};

/**
 * Plays one of the demo's mini-games inside its story: at the end the score sets the quality of
 * the work, the campaign moves on, and a button leads to the day's debrief.
 */
export const mountChallenge = (elements: ChallengeElements, setup: ChallengeSetup) => {
  const texts = CHALLENGE_TEXTS[setup.id];
  elements.title.textContent = texts.title;
  elements.story.textContent = texts.story;
  setup.game.start(elements.board, ({ score }) => {
    const after = setup.finish(setup.campaign, score);
    setup.save(after);
    const dayOver = after.stage === 'debrief';
    const next = element('a', 'pill-button challenge__next');
    next.href = dayOver ? '/debrief.html' : '/terminal.html';
    next.append(
      element('span', 'pill-button__label', dayOver ? 'Debrief' : 'Back to the terminal'),
    );
    elements.result.replaceChildren(
      element('h2', 'challenge__quality', `Score ${Math.round(score)} / 100`),
      element('p', 'challenge__verdict', QUALITY_TEXTS[setup.id][qualityOf(score)]),
      next,
    );
    elements.result.hidden = false;
  });
};
