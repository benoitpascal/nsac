import type { Mission } from './scenario-content';

/**
 * Page that plays a mission: the 3D base in mission mode (to drive the robot, or to walk to the
 * place where the mini-game is played), or the mini-game page.
 */
export const gamePage = (mission: Mission) =>
  mission.game.kind === 'walk' || mission.game.at !== undefined
    ? '/planet-walk.html?mission=1'
    : MINIGAME_PAGE;

/** Page to explore the base freely, standing in front of the terminal just left. */
export const EXPLORE_PAGE = '/planet-walk.html?at=terminal';
/** Page where the game starts: the astronaut wakes up in the crew quarters and walks to the terminal. */
export const WAKE_UP_PAGE = '/planet-walk.html';
export const DASHBOARD_PAGE = '/briefing.html';
export const DAY_PAGE = '/day.html';
/** Page of the mini-game of the current mission. */
export const MINIGAME_PAGE = '/mission.html';
