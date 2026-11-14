import type { RoundOutcome } from '../core/reaction-round';

const MISS_MARK = '✗';
const EMPTY_MARK = '·';

/** Short text of one round's slot: its time in ms, a cross for a false start, or a dot. */
export const roundSlotText = (outcome: RoundOutcome | undefined): string => {
  if (outcome === undefined) return EMPTY_MARK;
  return outcome.kind === 'time' ? `${Math.round(outcome.ms)}` : MISS_MARK;
};

/** Label shown right after a round: its time, or a warning for a press before green. */
export const shownLabel = (outcomes: readonly RoundOutcome[]): string => {
  const last = outcomes.at(-1);
  if (last === undefined) return '';
  return last.kind === 'time' ? `⚡ ${Math.round(last.ms)} ms` : '❌ Too soon!';
};
