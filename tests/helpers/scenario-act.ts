import type { Act, Mission } from '@/modules/scenario/core/scenario-content';

/** A mission played after packing a bag, for missions where the astronaut goes outside. */
export const missionWithBag: Mission = {
  id: 'excavator',
  title: 'Dig regolith',
  goal: 'Bring back 50 kg of regolith.',
  briefing: [],
  academy: [],
  preparation: true,
  game: { kind: 'walk' },
  scoring: 'excavator',
};

/** A mission played straight away, like the printer calibration. */
export const missionWithoutBag: Mission = {
  ...missionWithBag,
  id: 'printer',
  preparation: false,
  game: { kind: 'minigame', id: 'laser-mirrors' },
  scoring: 'printer',
};

/** The shelter, built in a mini-game once the planning picks it. */
export const shelterMission: Mission = {
  ...missionWithBag,
  id: 'shelter',
  preparation: false,
  game: { kind: 'minigame', id: 'precision-balance' },
  scoring: 'shelter',
};

/** The greenhouse, watered in a mini-game at the dome once the planning picks it. */
export const greenhouseMission: Mission = {
  ...missionWithBag,
  id: 'greenhouse',
  preparation: false,
  game: { kind: 'minigame', id: 'pipe-flow', at: 'greenhouse' },
  scoring: 'greenhouse',
};

/** One day of two missions played in the order the player picks, then a second day with none. */
export const twoMissionAct: Act = {
  id: 'moon',
  days: [
    {
      title: 'Day one',
      opening: [],
      closing: 'printer',
      missions: [missionWithBag, missionWithoutBag],
    },
    { title: 'Day two', opening: [], closing: 'night', missions: [] },
  ],
  ending: [],
};

/** Day one, then day two planned on the terminal, then a third day with nothing to play. */
export const plannedAct: Act = {
  id: 'moon',
  days: [
    twoMissionAct.days[0],
    {
      title: 'Day two',
      opening: [],
      closing: 'night',
      planning: true,
      missions: [shelterMission, greenhouseMission],
    },
    { title: 'Day three', opening: [], closing: 'night', missions: [] },
  ],
  ending: [],
};
