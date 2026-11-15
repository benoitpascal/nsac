import { describe, expect, it } from 'vitest';
import { bearingDegrees } from '@/modules/planet-walk/core/hud/compass';
import { excavatorGoals } from '@/modules/planet-walk/core/hud/excavator-goals';

describe('compass', () => {
  it('reads 0° at the start and grows turning right', () => {
    expect(bearingDegrees(0)).toBe(0);
    expect(bearingDegrees(-Math.PI / 2)).toBeCloseTo(90);
    expect(bearingDegrees(Math.PI / 2)).toBeCloseTo(270);
    expect(bearingDegrees(-5 * Math.PI)).toBeCloseTo(180);
  });
});

describe('excavator goals', () => {
  const start = { reachedDigZone: false, carriedKg: 0, deliveredKg: 0, goalKg: 50 };

  it('starts with nothing done and the count at zero', () => {
    const goals = excavatorGoals(start);
    expect(goals.map((goal) => goal.done)).toEqual([false, false, false]);
    expect(goals[2].label).toContain('(0/50)');
  });

  it('ticks each step as the robot is driven, fills up and drops off', () => {
    const driving = excavatorGoals({ ...start, reachedDigZone: true, carriedKg: 12 });
    expect(driving.map((goal) => goal.done)).toEqual([true, true, false]);
    const done = excavatorGoals({ ...start, reachedDigZone: true, deliveredKg: 61.4 });
    expect(done.map((goal) => goal.done)).toEqual([true, true, true]);
    expect(done[2].label).toContain('(50/50)');
  });
});
