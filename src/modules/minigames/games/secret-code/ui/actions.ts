import type { SymbolId } from '../core/rules';

/** What the player can do: add a symbol, remove the last one, or try the guess. */
export type PlayerActions = {
  add: (symbol: SymbolId) => void;
  remove: () => void;
  submit: () => void;
};
