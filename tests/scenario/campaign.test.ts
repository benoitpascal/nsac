import { describe, expect, it } from 'vitest';
import {
  confirmLoadout,
  continueAfterDebrief,
  dayDate,
  finishAcademy,
  newCampaign,
  openAcademy,
  readBriefing,
  recordResult,
  retryMission,
  startNextDay,
} from '@/modules/scenario/core/campaign';
import { DEFAULT_LOADOUT } from '@/modules/scenario/core/loadout';
import { scoreExcavator, scoreLaser } from '@/modules/scenario/core/scoring';
import { missionWithBag, missionWithoutBag, twoMissionAct } from '../helpers/scenario-act';

const START = Date.UTC(2026, 10, 15);

describe('a day of the Moon act', () => {
  let state = newCampaign(START);

  it('starts on the welcome of day one with the starting stores', () => {
    expect(state.stage).toBe('briefing');
    expect(state.stores).toEqual({ air: 100, power: 85, water: 60 });
  });

  it('shows the dashboard, then the academy, then the bag', () => {
    state = openAcademy(readBriefing(state));
    expect(state.stage).toBe('academy');
    state = finishAcademy(state, missionWithBag);
    expect(state.stage).toBe('preparation');
  });

  it('gets ready with the packed bag', () => {
    state = confirmLoadout(state, DEFAULT_LOADOUT);
    expect(state.stage).toBe('ready');
    expect(state.loadout).toEqual(DEFAULT_LOADOUT);
  });

  it('takes the mission cost from the base and debriefs it', () => {
    state = recordResult(state, scoreExcavator({ deliveredKg: 50, robotKwhUsed: 0.03 }));
    expect(state.stage).toBe('debrief');
    expect(state.stores).toEqual({ air: 100, power: 81, water: 65 });
  });

  it('keeps what was used when the mission is tried again', () => {
    const retried = retryMission(state, missionWithBag);
    expect(retried.stage).toBe('preparation');
    expect(retried.stores).toEqual(state.stores);
  });

  it('goes on to the second mission, played without a bag', () => {
    state = continueAfterDebrief(state, twoMissionAct);
    expect([state.stage, state.missionIndex]).toEqual(['briefing', 1]);
    state = finishAcademy(openAcademy(readBriefing(state)), missionWithoutBag);
    expect(state.stage).toBe('ready');
  });

  it('ends the day after its last mission, and the act when no day is left', () => {
    state = continueAfterDebrief(recordResult(state, scoreLaser(true, 90)), twoMissionAct);
    expect(state.stage).toBe('dayEnd');
    state = startNextDay(state, twoMissionAct);
    expect([state.stage, state.dayIndex]).toEqual(['actEnd', 1]);
  });

  it('dates day two one day after day one', () => {
    expect(dayDate(state) - START).toBe(86_400_000);
  });
});

describe('a step asked at the wrong time', () => {
  it('leaves the game unchanged', () => {
    const fresh = newCampaign(START);
    expect(finishAcademy(fresh, missionWithBag)).toBe(fresh);
    expect(recordResult(fresh, scoreLaser(true, 100))).toBe(fresh);
  });
});
