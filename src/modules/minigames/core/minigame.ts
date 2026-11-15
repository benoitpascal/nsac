/** How a game ended: won or not, with a score from 0 to 100. */
export type MiniGameResult = { won: boolean; score: number };

/** Stops a running game: clears its timers, animation frames and listeners. */
export type StopGame = () => void;

/** A mini-game the player picks from the training menu. */
export type MiniGame = {
  id: string;
  title: string;
  /** One short sentence telling the goal, for children. */
  summary: string;
  /** How to play, in a few short steps for children: the goal and the controls. */
  howTo: readonly string[];
  /**
   * Starts the game inside the container (which it fills as it likes) and calls finish once
   * when the game ends. Returns how to stop it at any time.
   */
  start: (container: HTMLElement, finish: (result: MiniGameResult) => void) => StopGame;
};

/** Highest score of a game. */
export const MAX_SCORE = 100;
