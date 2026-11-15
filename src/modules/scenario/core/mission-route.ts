import type { Mission } from './scenario-content';

/** Page that plays a mission: the 3D base in mission mode, or the mini-game page. */
export const gamePage = (mission: Mission) =>
  mission.game.kind === 'walk' ? '/planet-walk.html?mission=1' : '/mission.html';

/** Page to explore the base freely, without a mission. */
export const EXPLORE_PAGE = '/planet-walk.html';
export const DASHBOARD_PAGE = '/briefing.html';
export const DAY_PAGE = '/day.html';
