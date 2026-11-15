import { describe, expect, it } from 'vitest';
import { canAfford, chooseAction, missingFor } from '@/modules/scenario/core/actions';
import {
  closeDay,
  continueAfterDebrief,
  finishAcademy,
  newCampaign,
  recordResult,
  startNextDay,
  startPlanning,
} from '@/modules/scenario/core/campaign';
import { scoreShelter } from '@/modules/scenario/core/scoring';
import { plannedAct, shelterMission } from '../helpers/scenario-act';
import type { CampaignState } from '@/modules/scenario/core/campaign';

const act = plannedAct;

/** Morning of day two after a good day one: 9 bricks, power down to 54 %. */
const dayTwoMorning = (): CampaignState => ({
  ...newCampaign(Date.UTC(2026, 10, 15)),
  dayIndex: 1,
  stores: { air: 95, power: 54, water: 60, food: 65 },
  cargo: { regolithKg: 0, bricks: 9 },
  knowledge: 20,
});

describe('day two, planned on the terminal', () => {
  let state = dayTwoMorning();

  it('opens the planning once the mascot has spoken', () => {
    state = startPlanning(state, act);
    expect(state.stage).toBe('planning');
  });

  it('only lets the base pay for what it has, and says what is missing', () => {
    expect(canAfford(state, 'shelter')).toBe(true);
    expect(canAfford(state, 'workshop')).toBe(false);
    expect(missingFor(state, 'workshop')).toEqual({ bricks: 3 });
    expect(missingFor(state, 'research')).toEqual({ power: 16 });
  });

  it('pays for the shelter and opens its academy', () => {
    state = chooseAction(state, act, 'shelter');
    expect([state.stage, state.missionId, state.cargo.bricks, state.stores.power]).toEqual([
      'academy',
      'shelter',
      5,
      44,
    ]);
  });

  it('keeps how well the shelter was built, and what was learnt', () => {
    state = recordResult(finishAcademy(state, shelterMission), scoreShelter(true, 85));
    expect([state.shelterQuality, state.cargo.bricks, state.knowledge]).toEqual(['optimal', 5, 30]);
  });

  it('ends the day with the night alone, then opens day three', () => {
    state = continueAfterDebrief(state, act);
    expect(state.stage).toBe('dayClosing');
    state = closeDay(state, false);
    expect([state.stage, state.stores.food]).toEqual(['dayEnd', 60]);
    state = startNextDay(state, act);
    expect([state.stage, state.dayIndex]).toEqual(['actEnd', 2]);
  });
});

describe('another plan for day two', () => {
  it('grows the greenhouse at once: water and power spent, food gained, no mission', () => {
    const state = chooseAction(startPlanning(dayTwoMorning(), act), act, 'greenhouse');
    expect([state.stage, state.missionId, state.shelterQuality]).toEqual([
      'dayClosing',
      null,
      null,
    ]);
    expect(state.stores).toEqual({ air: 95, power: 44, water: 0, food: 85 });
  });

  it('refuses an action the base cannot pay', () => {
    const planning = startPlanning(dayTwoMorning(), act);
    expect(chooseAction(planning, act, 'research')).toBe(planning);
  });

  it('wastes bricks when the shelter is built roughly', () => {
    let state = chooseAction(startPlanning(dayTwoMorning(), act), act, 'shelter');
    state = recordResult(finishAcademy(state, shelterMission), scoreShelter(true, 50));
    expect([state.shelterQuality, state.cargo.bricks]).toEqual(['partial', 3]);
  });
});
