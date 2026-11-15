import { describe, expect, it } from 'vitest';
import { nextExcavatorCue } from '@/modules/planet-walk/core/excavator/excavator-cues';
import type { ExcavatorCue } from '@/modules/planet-walk/core/radio/base-radio-lines';

const none = new Set<ExcavatorCue>();
const at = (carriedKg: number, deliveredKg: number, unloading = false) => ({
  carriedKg,
  deliveredKg,
  goalKg: 50,
  unloading,
});

describe('excavator cues', () => {
  it('stays quiet until enough regolith is dug', () => {
    expect(nextExcavatorCue(none, at(49, 0))).toBeUndefined();
  });

  it('says « enough regolith » once the dug amount reaches the goal, counting what was dropped', () => {
    expect(nextExcavatorCue(none, at(50, 0))).toBe('enoughRegolith');
    expect(nextExcavatorCue(none, at(20, 30))).toBe('enoughRegolith');
    expect(nextExcavatorCue(new Set(['enoughRegolith']), at(60, 0))).toBeUndefined();
  });

  it('waits for the drums to stop before saying « unloaded », and says it once', () => {
    const said = new Set<ExcavatorCue>(['enoughRegolith']);
    expect(nextExcavatorCue(said, at(10, 50, true))).toBeUndefined();
    expect(nextExcavatorCue(said, at(0, 60))).toBe('unloaded');
    expect(nextExcavatorCue(new Set(['enoughRegolith', 'unloaded']), at(0, 60))).toBeUndefined();
  });

  it('skips « enough regolith » once the goal is already dropped off', () => {
    expect(nextExcavatorCue(none, at(0, 50))).toBe('unloaded');
  });
});
