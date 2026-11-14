import '../reflexes.css';
import { beginRound, pickDelay, press, startReflexes, turnGreen } from '../core/reaction-round';
import { scoreReflexes } from '../core/reaction-score';
import { listenToPresses } from './press-input';
import { createReflexesView } from './reflexes.view';
import type { MiniGameResult, StopGame } from '../../../core/minigame';
import type { ReflexState } from '../core/reaction-round';

/** How long (ms) a round's outcome stays on screen before the next round. */
const SHOWN_MS = 1100;
/** How long (ms) the final average stays on screen before the game ends. */
const OVER_MS = 1400;

/** Clock and randomness the game runs on, injected to keep the logic predictable. */
export type ReflexesDeps = { now: () => number; random: () => number };

/**
 * Runs the launch-control reflex test inside the container and calls finish once at the end.
 * Returns how to stop it, removing its timers and listeners.
 */
export const playReflexes = (
  container: HTMLElement,
  finish: (result: MiniGameResult) => void,
  deps: ReflexesDeps,
): StopGame => {
  const view = createReflexesView(container);
  let state: ReflexState = startReflexes();
  let timer: number | undefined;
  const schedule = (ms: number, action: () => void) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(action, ms);
  };
  const update = (next: ReflexState) => {
    state = next;
    view.render(state);
  };
  const nextRound = () => {
    update(beginRound(state));
    schedule(pickDelay(deps.random), () => update(turnGreen(state, deps.now())));
  };
  const onPress = () => {
    if (state.phase === 'ready') return nextRound();
    const before = state.phase;
    update(press(state, deps.now()));
    if (state.phase === before) return;
    if (state.phase === 'shown') return schedule(SHOWN_MS, nextRound);
    stopListening();
    schedule(OVER_MS, () => finish(scoreReflexes(state.outcomes)));
  };
  const stopListening = listenToPresses(view.root, onPress);
  view.render(state);
  return () => {
    window.clearTimeout(timer);
    stopListening();
  };
};
