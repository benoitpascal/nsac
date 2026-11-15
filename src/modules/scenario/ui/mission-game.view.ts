import { currentMission, recordResult } from '../core/campaign';
import { DASHBOARD_PAGE } from '../core/mission-route';
import { scorePrinter, scoreShelter } from '../core/scoring';
import type { CampaignState } from '../core/campaign';
import type { Act } from '../core/scenario-content';
import type { MiniGame } from '@/modules/minigames/core/minigame';
import { showHowTo } from '@/modules/minigames/ui/how-to.view';

export type MissionGameDeps = {
  act: Act;
  state: CampaignState;
  games: readonly MiniGame[];
  /** The box above the game telling how to play it. */
  howTo?: HTMLElement;
  save: (state: CampaignState) => void;
  navigate: (url: string) => void;
  /** Plays the chime of a goal reached, when the mini-game is won. */
  onWin?: () => void;
};

/** How long the win chime plays before the debrief opens (ms). */
const WIN_CHIME_MS = 1000;

/**
 * Plays the mini-game of the current mission; at its end, records the result and opens the
 * mascot's debrief. Without a mission ready to play, goes back to the station dashboard.
 */
export const playMissionGame = (title: HTMLElement, board: HTMLElement, deps: MissionGameDeps) => {
  const mission = currentMission(deps.act, deps.state);
  const ref = mission?.game;
  const game =
    ref?.kind === 'minigame' ? deps.games.find((candidate) => candidate.id === ref.id) : undefined;
  if (!mission || !game || deps.state.stage !== 'ready') {
    if (ref?.kind === 'minigame' && !game)
      console.error('[scenario] unknown mini-game', { id: ref.id });
    return deps.navigate(DASHBOARD_PAGE);
  }
  title.textContent = mission.title;
  if (deps.howTo) showHowTo(deps.howTo, game);
  game.start(board, ({ won, score }) => {
    const scoreGame = mission.scoring === 'shelter' ? scoreShelter : scorePrinter;
    deps.save(recordResult(deps.state, scoreGame(won, score)));
    if (!won || !deps.onWin) return deps.navigate(DASHBOARD_PAGE);
    deps.onWin();
    window.setTimeout(() => deps.navigate(DASHBOARD_PAGE), WIN_CHIME_MS);
  });
};
