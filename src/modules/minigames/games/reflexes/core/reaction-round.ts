/** One round: the reaction time in ms, or a press before green (false start). */
export type RoundOutcome = { kind: 'time'; ms: number } | { kind: 'falseStart' };

/**
 * Where the launch test stands: before the first round, waiting for green, green and waiting
 * for the press, showing a round's outcome, or over after the last round.
 */
export type ReflexPhase = 'ready' | 'waiting' | 'go' | 'shown' | 'over';

/** The whole test: its phase, when the light turned green (ms) and every round played. */
export type ReflexState = { phase: ReflexPhase; greenAt: number; outcomes: RoundOutcome[] };

/** Number of rounds in one test. */
export const ROUND_COUNT = 5;
/** Shortest and longest wait (ms) before the light turns green. */
const MIN_DELAY_MS = 1500;
const MAX_DELAY_MS = 4000;

/** Starts before the first round, with nothing played. */
export const startReflexes = (): ReflexState => ({ phase: 'ready', greenAt: 0, outcomes: [] });

/** Picks how long (ms) the light stays red, from a random number in [0, 1). */
export const pickDelay = (random: () => number): number =>
  MIN_DELAY_MS + random() * (MAX_DELAY_MS - MIN_DELAY_MS);

/** Starts a round: the light is red and the player must wait. */
export const beginRound = (state: ReflexState): ReflexState => ({ ...state, phase: 'waiting' });

/** Turns the light green at the given time (ms), if the round is still waiting. */
export const turnGreen = (state: ReflexState, now: number): ReflexState =>
  state.phase === 'waiting' ? { ...state, phase: 'go', greenAt: now } : state;

const record = (state: ReflexState, outcome: RoundOutcome): ReflexState => {
  const outcomes = [...state.outcomes, outcome];
  return { ...state, outcomes, phase: outcomes.length >= ROUND_COUNT ? 'over' : 'shown' };
};

/**
 * Handles a press at the given time (ms): too soon while red is a false start, while green it
 * records the reaction time; any other moment changes nothing.
 */
export const press = (state: ReflexState, now: number): ReflexState => {
  if (state.phase === 'waiting') return record(state, { kind: 'falseStart' });
  if (state.phase === 'go') return record(state, { kind: 'time', ms: now - state.greenAt });
  return state;
};
