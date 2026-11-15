/** Delayed calls that can all be cancelled at once. */
export type Timers = { after: (ms: number, run: () => void) => void; clear: () => void };

/** Creates a set of timeouts that `clear` cancels together. */
export const createTimers = (): Timers => {
  const pending = new Set<number>();
  return {
    after: (ms, run) => {
      const id = window.setTimeout(() => {
        pending.delete(id);
        run();
      }, ms);
      pending.add(id);
    },
    clear: () => {
      pending.forEach((id) => window.clearTimeout(id));
      pending.clear();
    },
  };
};
