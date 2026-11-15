import { describe, expect, it } from 'vitest';
import { scoreExcavator, scorePrinter } from '@/modules/scenario/core/scoring';

describe('excavator mission, driven from inside the base', () => {
  it('is efficient when the goal is met with little robot power, and costs no air', () => {
    const result = scoreExcavator({ deliveredKg: 50, robotKwhUsed: 0.02 });
    expect(result.verdict).toBe('efficient');
    expect(result.used).toEqual({ air: 0, power: 2.7, water: -5 });
  });

  it('is wasteful when the goal is met by draining the robot', () => {
    expect(scoreExcavator({ deliveredKg: 60, robotKwhUsed: 0.03 }).verdict).toBe('wasteful');
  });

  it('is unfinished below the goal', () => {
    expect(scoreExcavator({ deliveredKg: 49, robotKwhUsed: 0 }).verdict).toBe('unfinished');
  });
});

describe('printer calibration (laser mirrors)', () => {
  it('is efficient and optimal with a good score, and costs a little power', () => {
    const result = scorePrinter(true, 90);
    expect([result.verdict, result.used.power, result.details.score]).toEqual(['efficient', 3, 90]);
  });

  it('is wasteful with many mirror flips', () => {
    expect(scorePrinter(true, 40).verdict).toBe('wasteful');
  });

  it('is unfinished when given up', () => {
    expect(scorePrinter(false, 0).verdict).toBe('unfinished');
  });
});
