import type { Mission } from './scenario-content';

/** Page that plays a mission: the 3D base in mission mode, or the mini-game page. */
export const gamePage = (mission: Mission) =>
  mission.game.kind === 'walk' ? '/planet-walk.html?mission=1' : '/mission.html';

/** Page to explore the base freely, standing in front of the terminal just left. */
export const EXPLORE_PAGE = '/planet-walk.html?at=terminal';
/** Page where the game starts: the astronaut wakes up in the crew quarters and walks to the terminal. */
export const WAKE_UP_PAGE = '/planet-walk.html';
export const DASHBOARD_PAGE = '/briefing.html';
export const DAY_PAGE = '/day.html';
