import { CODE_LENGTH, SYMBOL_COUNT } from './rules';
import type { Feedback, SymbolId } from './rules';

/** Draws a secret code of CODE_LENGTH different symbols, using the given random source. */
export const createCode = (random: () => number = Math.random): SymbolId[] => {
  const pool = Array.from({ length: SYMBOL_COUNT }, (_, symbol) => symbol);
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [pool[index], pool[other]] = [pool[other], pool[index]];
  }
  return pool.slice(0, CODE_LENGTH);
};

const countOf = (symbols: readonly SymbolId[], symbol: SymbolId) =>
  symbols.filter((candidate) => candidate === symbol).length;

/** Tells how many symbols of the guess are at the right place, and how many are elsewhere. */
export const compareGuess = (code: readonly SymbolId[], guess: readonly SymbolId[]): Feedback => {
  const exact = guess.filter((symbol, index) => code[index] === symbol).length;
  const shared = [...new Set(guess)].reduce(
    (total, symbol) => total + Math.min(countOf(code, symbol), countOf(guess, symbol)),
    0,
  );
  return { exact, misplaced: shared - exact };
};
