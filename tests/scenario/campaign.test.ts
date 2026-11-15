import { describe, expect, it } from 'vitest';
import {
  chooseMission,
  closeDay,
  confirmLoadout,
  continueAfterDebrief,
  currentMission,
  dayDate,
  finishAcademy,
  newCampaign,
  recordResult,
  retryMission,
  startNextDay,
} from '@/modules/scenario/core/campaign';
import { DEFAULT_LOADOUT } from '@/modules/scenario/core/loadout';
import { scoreExcavator, scorePrinter } from '@/modules/scenario/core/scoring';
import { missionWithBag, missionWithoutBag, twoMissionAct } from '../helpers/scenario-act';

const START = Date.UTC(2026, 10, 15);
const act = twoMissionAct;

describe('day one, printer first then robot', () => {
  let state = newCampaign(START);

  it('starts on the welcome of day one, with no regolith, 4 bricks and no knowledge', () => {
    expect([state.stage, state.missionId]).toEqual(['briefing', null]);
    expect(state.stores).toEqual({ air: 100, power: 85, water: 60, food: 70 });
    expect([state.cargo, state.knowledge]).toEqual([{ regolithKg: 0, bricks: 4 }, 0]);
  });

  it('opens the academy of the mission picked in the dialogue', () => {
    state = chooseMission(state, act, 'printer');
    expect([state.stage, currentMission(act, state)?.id]).toEqual(['academy', 'printer']);
  });

  it('records the calibration and debriefs it', () => {
    state = recordResult(finishAcademy(state, missionWithoutBag), scorePrinter(true, 80));
    expect([state.stage, state.printerQuality]).toEqual(['debrief', 'optimal']);
  });

  it('goes on to the mission left, without asking again', () => {
    state = continueAfterDebrief(state, act);
    expect([state.stage, state.missionId]).toEqual(['academy', 'excavator']);
  });

  it('keeps the regolith the robot brought, and what was learnt', () => {
    state = finishAcademy(state, missionWithBag);
    state = recordResult(
      confirmLoadout(state, DEFAULT_LOADOUT),
      scoreExcavator({ deliveredKg: 52, robotKwhUsed: 0.02 }),
    );
    expect([state.cargo.regolithKg, state.knowledge]).toEqual([52, 10]);
  });

  it('closes the day once both missions are done', () => {
    state = continueAfterDebrief(state, act);
    expect([state.stage, state.doneMissionIds]).toEqual(['dayClosing', ['printer', 'excavator']]);
  });

  it('prints bricks from the regolith for 20 % power, then the night costs 5 % of each store', () => {
    const before = state.stores;
    state = closeDay(state, true);
    expect([state.cargo, state.knowledge]).toEqual([{ regolithKg: 0, bricks: 9 }, 20]);
    expect(state.stores.power).toBeCloseTo(before.power - 20 - 5);
    expect([state.stores.air, state.stores.food]).toEqual([before.air - 5, before.food - 5]);
    expect(state.stage).toBe('dayEnd');
  });

  it('dates day two one day after day one and ends the act when no day is left', () => {
    state = startNextDay(state, act);
    expect([state.stage, state.dayIndex, dayDate(state) - START]).toEqual([
      'actEnd',
      1,
      86_400_000,
    ]);
  });
});

describe('closing day one without printing', () => {
  it('keeps the regolith and the power, and still pays the night', () => {
    let state = chooseMission(newCampaign(START), act, 'excavator');
    state = recordResult(
      confirmLoadout(finishAcademy(state, missionWithBag), DEFAULT_LOADOUT),
      scoreExcavator({ deliveredKg: 50, robotKwhUsed: 0 }),
    );
    state = continueAfterDebrief(state, act);
    state = recordResult(finishAcademy(state, missionWithoutBag), scorePrinter(true, 30));
    const beforeNight = continueAfterDebrief(state, act);
    state = closeDay(beforeNight, false);
    expect(state.cargo).toEqual({ regolithKg: 50, bricks: 4 });
    expect(state.stores.power).toBeCloseTo(beforeNight.stores.power - 5);
  });
});

describe('a badly tuned printer', () => {
  it('turns only 30 % of the regolith into bricks', () => {
    let state = chooseMission(newCampaign(START), act, 'printer');
    state = recordResult(finishAcademy(state, missionWithoutBag), scorePrinter(true, 20));
    state = continueAfterDebrief(state, act);
    state = recordResult(
      confirmLoadout(finishAcademy(state, missionWithBag), DEFAULT_LOADOUT),
      scoreExcavator({ deliveredKg: 100, robotKwhUsed: 0 }),
    );
    state = closeDay(continueAfterDebrief(state, act), true);
    expect(state.cargo.bricks).toBe(4 + 3);
  });
});

describe('a step asked at the wrong time', () => {
  it('leaves the game unchanged', () => {
    const fresh = newCampaign(START);
    expect(finishAcademy(fresh, missionWithBag)).toBe(fresh);
    expect(recordResult(fresh, scorePrinter(true, 100))).toBe(fresh);
    expect(closeDay(fresh, true)).toBe(fresh);
    expect(chooseMission(fresh, act, 'unknown')).toBe(fresh);
  });

  it('keeps what was used when a mission is tried again', () => {
    let state = chooseMission(newCampaign(START), act, 'excavator');
    state = recordResult(
      confirmLoadout(finishAcademy(state, missionWithBag), DEFAULT_LOADOUT),
      scoreExcavator({ deliveredKg: 10, robotKwhUsed: 0.03 }),
    );
    const retried = retryMission(state, missionWithBag);
    expect([retried.stage, retried.stores.power]).toEqual(['preparation', 81]);
  });
});
