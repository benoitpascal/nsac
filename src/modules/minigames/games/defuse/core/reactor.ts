import { MAX_SCORE } from '../../../core/minigame';

/** Time given to cool the reactor down, in milliseconds. */
export const COUNTDOWN_MS = 90_000;
/** Time taken away by a mistake, in milliseconds. */
export const MISTAKE_PENALTY_MS = 10_000;
/** Number of panels to solve, one after the other. */
export const PANEL_COUNT = 3;
/** Part of the score earned by any win; the rest comes from the time left. */
const WIN_BASE_SCORE = 40;
/** Score earned by each solved panel when the time runs out. */
const LOST_SCORE_PER_PANEL = 10;

/** Time left before overheating (ms) and how many panels are already solved. */
export type Reactor = { timeLeftMs: number; solvedPanels: number };

/** Starts with the full countdown and no panel solved. */
export const startReactor = (): Reactor => ({ timeLeftMs: COUNTDOWN_MS, solvedPanels: 0 });

/** Returns the reactor after some time has passed (ms), never below zero. */
export const passTime = (reactor: Reactor, elapsedMs: number): Reactor => ({
  ...reactor,
  timeLeftMs: Math.max(0, reactor.timeLeftMs - elapsedMs),
});

/** Returns the reactor after a mistake, which costs time. */
export const makeMistake = (reactor: Reactor): Reactor => passTime(reactor, MISTAKE_PENALTY_MS);

/** Returns the reactor with one more panel solved. */
export const solvePanel = (reactor: Reactor): Reactor => ({
  ...reactor,
  solvedPanels: Math.min(PANEL_COUNT, reactor.solvedPanels + 1),
});

/** Tells whether every panel is solved. */
export const isCooled = (reactor: Reactor) => reactor.solvedPanels >= PANEL_COUNT;

/** Tells whether the countdown is over. */
export const isOverheated = (reactor: Reactor) => !isCooled(reactor) && reactor.timeLeftMs <= 0;

/** Share of the countdown still left, from 1 (full) to 0 (empty). */
export const timeShare = (reactor: Reactor) => reactor.timeLeftMs / COUNTDOWN_MS;

/**
 * Score of a finished game: a win scores from the time left (the faster, the higher),
 * an overheated reactor scores only from the panels solved, always below any win.
 */
export const scoreOf = (reactor: Reactor) =>
  isCooled(reactor)
    ? Math.round(WIN_BASE_SCORE + (MAX_SCORE - WIN_BASE_SCORE) * timeShare(reactor))
    : reactor.solvedPanels * LOST_SCORE_PER_PANEL;
