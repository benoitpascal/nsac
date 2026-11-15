import { describe, expect, it } from 'vitest';
import { MOON_ACT } from '@/modules/scenario/core/act-moon';
import { newCampaign } from '@/modules/scenario/core/campaign';
import { actProgress, dayLabel, dayObjectives } from '@/modules/scenario/core/progress';

const start = newCampaign(0);

describe('main mission progress', () => {
  it('starts at zero', () => {
    expect(actProgress(MOON_ACT, start)).toBe(0);
  });

  it('counts the missions played today and on the days before, one per planned day', () => {
    expect(actProgress(MOON_ACT, { ...start, doneMissionIds: ['excavator'] })).toBeCloseTo(1 / 3);
    expect(actProgress(MOON_ACT, { ...start, dayIndex: 1, doneMissionIds: [] })).toBeCloseTo(2 / 3);
    expect(actProgress(MOON_ACT, { ...start, dayIndex: 1, doneMissionIds: ['greenhouse'] })).toBe(
      1,
    );
    expect(actProgress(MOON_ACT, { ...start, dayIndex: 2, doneMissionIds: [] })).toBe(1);
  });

  it('is complete once the act has ended', () => {
    expect(actProgress(MOON_ACT, { ...start, stage: 'actEnd' })).toBe(1);
  });
});

describe('day label', () => {
  it('pads the day number like the mock-up', () => {
    expect([dayLabel(0), dayLabel(11)]).toEqual(['Day 01', 'Day 12']);
  });
});

describe('day objectives', () => {
  it("lists today's missions, ticks the played ones and marks the picked one", () => {
    const state = { ...start, doneMissionIds: ['excavator'], missionId: 'printer' };
    expect(
      dayObjectives(MOON_ACT, state).map(({ id, done, current }) => [id, done, current]),
    ).toEqual([
      ['excavator', true, false],
      ['printer', false, true],
    ]);
  });

  it('shows only the mission the commander picked on a planned day', () => {
    const planned = { ...start, dayIndex: 1 };
    expect(dayObjectives(MOON_ACT, planned).map(({ id }) => id)).toEqual(['shelter', 'greenhouse']);
    expect(
      dayObjectives(MOON_ACT, { ...planned, missionId: 'greenhouse' }).map(({ id }) => id),
    ).toEqual(['greenhouse']);
  });

  it('is empty on a day without missions', () => {
    expect(dayObjectives(MOON_ACT, { ...start, dayIndex: 2 })).toEqual([]);
  });
});
