import { describe, expect, it } from 'vitest';
import { scoreExcavator, scoreLaser } from '@/modules/scenario/core/scoring';

describe('excavator mission', () => {
  it('is efficient when the goal is met without spending much', () => {
    const result = scoreExcavator({ deliveredKg: 50, secondsOutside: 120, robotKwhUsed: 0.02 });
    expect(result.verdict).toBe('efficient');
    expect(result.used).toEqual({ air: 4, power: 2.7, water: -5 });
  });

  it('is wasteful when the goal is met by spending too much', () => {
    const result = scoreExcavator({ deliveredKg: 60, secondsOutside: 270, robotKwhUsed: 0.06 });
    expect(result.verdict).toBe('wasteful');
  });

  it('is unfinished below the goal', () => {
    expect(scoreExcavator({ deliveredKg: 49, secondsOutside: 10, robotKwhUsed: 0 }).verdict).toBe(
      'unfinished',
    );
  });
});

describe('laser mission', () => {
  it('is efficient with a good score and costs a little power', () => {
    const result = scoreLaser(true, 90);
    expect([result.verdict, result.used.power]).toEqual(['efficient', 3]);
  });

  it('is wasteful with many mirror flips', () => {
    expect(scoreLaser(true, 40).verdict).toBe('wasteful');
  });

  it('is unfinished when given up', () => {
    expect(scoreLaser(false, 0).verdict).toBe('unfinished');
  });
});
