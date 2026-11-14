/** Callbacks run later, all dropped at once when the game stops. */
export type Timeouts = {
  later: (callback: () => void, delayMs: number) => void;
  clearAll: () => void;
};

/** Keeps track of pending timeouts so none outlives the game. */
export const createTimeouts = (): Timeouts => {
  const pending = new Set<number>();
  const later = (callback: () => void, delayMs: number) => {
    const id = window.setTimeout(() => {
      pending.delete(id);
      callback();
    }, delayMs);
    pending.add(id);
  };
  const clearAll = () => {
    pending.forEach((id) => window.clearTimeout(id));
    pending.clear();
  };
  return { later, clearAll };
};
