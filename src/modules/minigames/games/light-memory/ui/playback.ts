import { lightGapMs, lightOnMs } from '../core/timing';
import type { Timers } from './timers';

/** Wait before showing a sequence, so the player can get ready (ms). */
const READY_MS = 900;

/**
 * Lights each light of the sequence in turn through `flash`, faster for longer sequences, then
 * calls `done` once the last one has gone out.
 */
export const playSequence = (
  timers: Timers,
  sequence: readonly number[],
  flash: (light: number, ms: number) => void,
  done: () => void,
) => {
  const onMs = lightOnMs(sequence.length);
  const step = onMs + lightGapMs(sequence.length);
  sequence.forEach((light, index) =>
    timers.after(READY_MS + index * step, () => flash(light, onMs)),
  );
  timers.after(READY_MS + sequence.length * step, done);
};
