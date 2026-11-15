import { describe, expect, it } from 'vitest';
import { gamePage } from '@/modules/scenario/core/mission-route';
import { greenhouseMission, missionWithoutBag, shelterMission } from '../helpers/scenario-act';

describe('mission game page', () => {
  it('opens the mini-game page for a mini-game played at the terminal', () => {
    expect([gamePage(missionWithoutBag), gamePage(shelterMission)]).toEqual([
      '/mission.html',
      '/mission.html',
    ]);
  });

  it('opens the base first for a mini-game played at the greenhouse', () => {
    expect(gamePage(greenhouseMission)).toBe('/planet-walk.html?mission=1');
  });
});
