import { describe, expect, it } from 'vitest';
import { scoreGreenhouse } from '@/modules/scenario/core/greenhouse-scoring';
import { scoreExcavator, scorePrinter, scoreShelter } from '@/modules/scenario/core/scoring';

describe('excavator mission, driven from inside the base', () => {
  it('is efficient when the goal is met with little robot power, and costs no air', () => {
    const result = scoreExcavator({ deliveredKg: 50, robotKwhUsed: 0.02 });
    expect(result.verdict).toBe('efficient');
    expect(result.used).toEqual({ power: 2.7, water: -5 });
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

describe('shelter build (precision balance)', () => {
  it('wastes no bricks when done well', () => {
    const result = scoreShelter(true, 85);
    expect([result.verdict, result.shelterQuality, result.bricks, result.knowledge]).toEqual([
      'efficient',
      'optimal',
      0,
      10,
    ]);
  });

  it('wastes 2 bricks when done roughly', () => {
    const result = scoreShelter(true, 50);
    expect([result.verdict, result.shelterQuality, result.bricks, result.knowledge]).toEqual([
      'wasteful',
      'partial',
      -2,
      6,
    ]);
  });

  it('leaves the shelter unfinished and loses 2 bricks when given up', () => {
    const result = scoreShelter(false, 0);
    expect([result.verdict, result.shelterQuality, result.bricks]).toEqual([
      'unfinished',
      'failed',
      -2,
    ]);
  });
});

describe('greenhouse irrigation (pipe flow)', () => {
  it('grows 20 points of food with no leak when the pipes are laid well', () => {
    const result = scoreGreenhouse(true, 90);
    expect([result.verdict, result.used, result.knowledge]).toEqual([
      'efficient',
      { water: 0, food: -20 },
      10,
    ]);
  });

  it('leaks water when the pipes are turned too often', () => {
    expect(scoreGreenhouse(true, 50).used).toEqual({ water: 8, food: -20 });
  });

  it('leaks more and waters only half the seeds when very rough', () => {
    const result = scoreGreenhouse(true, 10);
    expect([result.verdict, result.used]).toEqual(['wasteful', { water: 15, food: -10 }]);
  });

  it('grows nothing when given up', () => {
    const result = scoreGreenhouse(false, 0);
    expect([result.verdict, result.objectiveShare, result.used.food]).toEqual(['unfinished', 0, 0]);
  });
});
