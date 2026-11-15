import { compareGuess } from './code';
import { CODE_LENGTH, MAX_TRIES, scoreForTries } from './rules';
import type { Feedback, SymbolId } from './rules';

/** A submitted guess with how close it was. */
export type PlayedGuess = { symbols: SymbolId[]; feedback: Feedback };

/** Whether the player is still guessing, opened the airlock, or ran out of tries. */
export type GameStatus = 'playing' | 'won' | 'lost';

/** Everything about a game: the secret code, past guesses and the guess being built. */
export type GameState = {
  code: SymbolId[];
  guesses: PlayedGuess[];
  current: SymbolId[];
  status: GameStatus;
};

/** Starts a game on the given secret code. */
export const startGame = (code: SymbolId[]): GameState => ({
  code,
  guesses: [],
  current: [],
  status: 'playing',
});

/** Whether the symbol can be added to the guess being built (not full, not used yet). */
export const canAdd = (state: GameState, symbol: SymbolId): boolean =>
  state.status === 'playing' &&
  state.current.length < CODE_LENGTH &&
  !state.current.includes(symbol);

/** Adds a symbol at the end of the guess being built, when allowed. */
export const addSymbol = (state: GameState, symbol: SymbolId): GameState =>
  canAdd(state, symbol) ? { ...state, current: [...state.current, symbol] } : state;

/** Removes the last symbol of the guess being built. */
export const removeSymbol = (state: GameState): GameState =>
  state.status === 'playing' ? { ...state, current: state.current.slice(0, -1) } : state;

/** Whether the guess being built is complete and can be tried. */
export const canSubmit = (state: GameState): boolean =>
  state.status === 'playing' && state.current.length === CODE_LENGTH;

const statusAfter = (feedback: Feedback, triesUsed: number): GameStatus => {
  if (feedback.exact === CODE_LENGTH) return 'won';
  return triesUsed >= MAX_TRIES ? 'lost' : 'playing';
};

/** Tries the complete guess against the code and records how close it was. */
export const submitGuess = (state: GameState): GameState => {
  if (!canSubmit(state)) return state;
  const feedback = compareGuess(state.code, state.current);
  const guesses = [...state.guesses, { symbols: state.current, feedback }];
  return { ...state, guesses, current: [], status: statusAfter(feedback, guesses.length) };
};

/** Final score of the game: depends on the tries left when won, 0 when lost or unfinished. */
export const scoreOf = (state: GameState): number =>
  state.status === 'won' ? scoreForTries(state.guesses.length) : 0;
