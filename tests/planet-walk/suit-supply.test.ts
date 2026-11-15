import { describe, expect, it } from 'vitest';
import { FULL_SUIT, needsRescue, stepSuit } from '@/modules/planet-walk/core/suit/suit-supply';

const ONE_BOTTLE = { oxygenBottles: 1, extraItems: 0 };

describe('suit outside', () => {
  it('uses more oxygen walking than resting, and more running than walking', () => {
    const [rest, walk, run] = (['rest', 'walk', 'run'] as const).map(
      (effort) => stepSuit(FULL_SUIT, effort, true, ONE_BOTTLE, 10).oxygen,
    );
    expect(walk).toBeLessThan(rest);
    expect(run).toBeLessThan(walk);
  });

  it('uses oxygen while busy with an action', () => {
    expect(stepSuit(FULL_SUIT, 'action', true, ONE_BOTTLE, 10).oxygen).toBeLessThan(
      stepSuit(FULL_SUIT, 'rest', true, ONE_BOTTLE, 10).oxygen,
    );
  });

  it('lasts longer with an extra bottle, and shorter with more items carried', () => {
    const base = stepSuit(FULL_SUIT, 'walk', true, ONE_BOTTLE, 10).oxygen;
    expect(
      stepSuit(FULL_SUIT, 'walk', true, { oxygenBottles: 2, extraItems: 0 }, 10).oxygen,
    ).toBeGreaterThan(base);
    expect(
      stepSuit(FULL_SUIT, 'walk', true, { oxygenBottles: 1, extraItems: 2 }, 10).oxygen,
    ).toBeLessThan(base);
  });

  it('calls for rescue at 9 %', () => {
    expect(needsRescue({ oxygen: 9, battery: 50 })).toBe(true);
    expect(needsRescue({ oxygen: 50, battery: 9 })).toBe(true);
    expect(needsRescue({ oxygen: 10, battery: 10 })).toBe(false);
  });
});

describe('suit inside the base', () => {
  it('refills', () => {
    expect(stepSuit({ oxygen: 20, battery: 20 }, 'run', false, ONE_BOTTLE, 1)).toEqual({
      oxygen: 28,
      battery: 28,
    });
  });
});
