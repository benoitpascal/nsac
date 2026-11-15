import { describe, expect, it } from 'vitest';
import { greenhouseGoals } from '@/modules/planet-walk/core/hud/greenhouse-goals';
import {
  availableAction,
  ERRAND_REACH_M,
} from '@/modules/planet-walk/core/station/station-actions';
import type { StationSpots } from '@/modules/planet-walk/core/station/station-actions';

const spots: StationSpots = {
  console: { x: 0, z: 0 },
  passages: [],
  wakeUp: { x: 0, z: 0, heading: 0 },
  terminalFront: { x: 0, z: -1.6, heading: 0 },
};
const dome = { x: 40, z: 0 };

describe('greenhouse errand action', () => {
  it('offers the watering next to the dome, during the greenhouse mission only', () => {
    const near = { x: dome.x - ERRAND_REACH_M + 0.5, z: 0 };
    expect(availableAction('walking', near, { ...spots, errand: dome })).toEqual({
      kind: 'doErrand',
    });
    expect(availableAction('walking', near, spots)).toBeUndefined();
  });

  it('offers nothing far from the dome', () => {
    expect(availableAction('walking', { x: 20, z: 0 }, { ...spots, errand: dome })).toBeUndefined();
  });
});

describe('greenhouse goals', () => {
  it('ticks going out, then reaching the dome, and leaves the watering to do', () => {
    const done = (wentOut: boolean, reached: boolean) =>
      greenhouseGoals({ wentOut, reached }).map((goal) => goal.done);
    expect(done(false, false)).toEqual([false, false, false]);
    expect(done(true, false)).toEqual([true, false, false]);
    expect(done(false, true)).toEqual([true, true, false]);
  });
});
